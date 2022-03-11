#!/usr/bin/python3
"""
    
    module
    return: nothing
"""
import cherrypy
import cherrypy_cors
from multiprocessing import Process, Array, Value
from vectors import Vec2
import json
cherrypy_cors.install()
import requests
from mongoengine import connect, Document, StringField, ListField, ObjectIdField, PointField
connect("test")

cherrypy.config.update({
    'server.socket_host': '0.0.0.0',
    'server.socket_port': 5001
})
cherrypy.engine.restart()

config_obj = {}
bus_coords = Array('d', 2)
idx_path = 0
bus_path = []
idx_stop = Value('i', 0)
bus_stops = []

def frame():
    act = Vec2(bus_path[0][0], bus_path[0][1])
    idx_path = 0
    stop_vec = Vec2(bus_stops[0][0], bus_stops[0][1])
    while(1):
        obj = Vec2(bus_path[idx_path][0], bus_path[idx_path][1])
        while((obj - act).module > 0.0000004):
            vel = ((stop_vec - act).module)*4000 + 1
            if vel > 10:
                vel = 10
            act += (obj - act).normalize() * 0.000000001 * vel
            bus_coords[0] = act.x
            bus_coords[1] = act.y
            if (stop_vec - act).module < 0.0002:
                idx_stop.value += 1
                if idx_stop.value >= len(bus_stops):
                    idx_stop.value = 0
                stop_vec = Vec2(bus_stops[idx_stop.value][0], bus_stops[idx_stop.value][1])
        idx_path += 1
        if idx_path >= len(bus_path):
            idx_path = 0
            act = Vec2(bus_path[0][0], bus_path[0][1])


domain = "http://35.237.138.76:5001"
bus_id = ""
def update_route():
    r = requests.get(domain + "/api/buses/get/" + bus_id)
    if r.status_code != 200:
        print("invalid bus")
        return False
    r = requests.get(domain + "/api/routes/get/" + json.loads(r.text)["route"])
    if r.status_code != 200:
        print("invalid route")
        return False
    js = json.loads(r.text)
    geojson = {
        "type": "FeatureCollection",
	"features": [
            {
		"type": "Feature",
		"properties": {},
	        "geometry": js["points"]
            }
        ]
    }
    for i in js["points"]["coordinates"]:
        bus_path.append(i[:])
    for stop_id in js["stops"]:
        tmp = {
            "type": "Feature",
            "properties": {}, 
            "geometry": {}
        }
        r = requests.get(domain + "/api/stops/get/" + stop_id)
        tmp["geometry"] = json.loads(r.text)["position"]
        geojson["features"].append(tmp)
        bus_stops.append(tmp["geometry"]["coordinates"][:])
    txt = json.dumps(geojson, indent=4, sort_keys=True)
    with open("data/route.json", "w") as f:
        f.write(txt)

class Point(Document):
    owner = ObjectIdField(required=True)
    position = PointField(required=True)
    content = StringField()

    def to_dict(self):
        out = json.loads(self.to_json())
        out["_id"] = out["_id"]["$oid"]
        out["owner"] = out["owner"]["$oid"]
        return out


def get_radius_stops():
    ids = []
    objs = []
    print("started")
    for stop in bus_stops:
        print(stop)
        radius = requests.get(domain + "/api/points/radius/{}/{}/0.5".format(stop[0], stop[1]))
        j = json.loads(radius.text)
        for obj in j:
            if obj["_id"] in ids:
                continue
            ids.append(obj["_id"])
            objs.append(obj)
    Point.objects().delete()
    for obj in objs:
        del obj["_id"]
        p = Point(**obj)
        p.save()
        print(obj)


class Root(object):
    @cherrypy.expose
    def index(self):
        return "/bus /route\n"

class Route_api(object):
    @cherrypy.expose
    def index(self):
        out = ""
        with open("data/route.json", "r") as f:
            out = f.read()
        return out


class State_api(object):
    @cherrypy.expose
    def index(self):
        return json.dumps({
            "position": list(bus_coords),
            "next_stop": bus_stops[int(idx_stop.value)],
            "point_id": 0,
            "config": config_obj
        })

class Point_api(object):
    @cherrypy.expose
    def index(self):
        out = []
        for obj in Point.objects(position__geo_within_center=[(bus_coords[0], bus_coords[1]), 0.3]):
            out.append(obj.to_dict())
        return json.dumps(out)

if __name__ == "__main__":
    config = {
            '/': {
                'cors.expose.on': True
            },
        }
    username = input("username: ")
    response = requests.get(domain + "/api/users/" + username + "/buses/")
    print(response.text)
    if (response.status_code != 200):
        exit()
    bus_input = input("bus: ")
    response = requests.get(domain + "/api/buses/get/" + bus_input)
    print(response.text)
    if (response.status_code != 200):
        exit()
    bus_id = json.loads(response.text)["_id"]
    update_route()
    print(bus_stops)
    print(bus_path)
    get_radius_stops()
    p = Process(target=frame)
    p.start()
    root = Root()
    root.state = State_api()
    root.route = Route_api()
    root.points = Point_api()
    cherrypy.quickstart(root, config=config)
    p.join()
