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
import math
import datetime
from mongoengine import connect, disconnect_all, Document, StringField, ListField, ObjectIdField, PointField
connect('testdb2')

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
bus_dir = Value('d', 0)
bus_stops = []
def frame(bus_id):
    act = Vec2(bus_path[0][0], bus_path[0][1])
    idx_path = 0
    stop_vec = Vec2(bus_stops[0][0], bus_stops[0][1])
    while(1):
        obj = Vec2(bus_path[idx_path][0], bus_path[idx_path][1])
        while((obj - act).module > 0.0000004):
            diff = obj - act
            bus_dir.value = math.degrees(math.atan(diff.y / diff.x))
            vel = ((stop_vec - act).module)*800 + 1
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
def update_route(data):
    print("data: {}".format(data))
    r1 = requests.get(domain + "/api/buses/get/" + data["bus_id"])
    if r1.status_code != 200:
        print("invalid bus")
        return {
            "status": False,
            "data": data
        }
    if (json.loads(r1.text)["route"] == data["route_id"]):
        return {
            "status": False,
            "data": data
        }
    data["route_id"] = json.loads(r1.text)["route"]
    print("new route: {}".format(data["route_id"]))
    r = requests.get(domain + "/api/routes/data/" + json.loads(r1.text)["route"])
    if r.status_code != 200:
        print("invalid route")
        return {
            "status": False,
            "data": data
        }
    while len(bus_path):
        bus_path.pop()
    while len(bus_stops):
        bus_stops.pop()
    js = json.loads(r.text)
    lis = js["features"][0]["geometry"]["coordinates"]
    for point in lis:
        bus_path.append(point[:])
    bus_coords[0] = bus_path[0][0]
    bus_coords[1] = bus_path[0][1]
    for idx in range(1, len(js["features"])):
        bus_stops.append(js["features"][idx]["geometry"]["coordinates"][:])
    txt = json.dumps(js, indent=4, sort_keys=True)
    with open("data/route.json", "w") as f:
        f.write(txt)
    return {
        "status": True,
        "data": data
    }


class Point(Document):
    owner = ObjectIdField(required=True)
    position = PointField(required=True)
    content = StringField()

    def to_dict(self):
        out = json.loads(self.to_json())
        out["_id"] = out["_id"]["$oid"]
        out["owner"] = out["owner"]["$oid"]
        return out


def get_radius_stops(id):
    ids = []
    Point.objects().delete()
    radius_raw = requests.get(domain + "/api/routes/points/{}".format(id))
    r_list = json.loads(str(radius_raw.text))
    for obj in r_list:
        if obj["_id"] in ids:
            continue
        ids.append(obj["_id"])
        if "_id" in obj:
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

data = {
    "bus_id": "",
    "route_id": "",
    "proc": None
}
class State_api(object):
    @cherrypy.expose
    def index(self):
        return json.dumps({
            "position": list(bus_coords),
            "next_stop": bus_stops[int(idx_stop.value)],
            "point_id": 0,
            "direction": bus_dir.value,
            "config": config_obj,
            "route_id": data["route_id"]
        })

class Point_api(object):
    @cherrypy.expose
    def index(self):
        out = []
        for obj in Point.objects(position__geo_within_center=[(bus_coords[0], bus_coords[1]), 0.002]):
            out.append(obj.to_dict())
        return json.dumps(out)
class Update_api(object):
    @cherrypy.expose
    def index(self):
        var = dict(data)
        res = update_route(var)
        if not res["status"]:
            return json.dumps({"changed": 0, "id": data["route_id"]})
        res2 = get_radius_stops(var["route_id"])
        data["route_id"] = res["data"]["route_id"]
        data["proc"].join()
        return json.dumps({"changed": 1, "id": data["route_id"]})
        

if __name__ == "__main__":
    config = {
            '/': {
                'cors.expose.on': True
            },
        }
    username = input("username: ")
    response = requests.get(domain + "/api/users/" + username + "/buses/")
    print(json.dumps(json.loads(response.text), indent=4, sort_keys=4))
    if (response.status_code != 200):
        exit()
    bus_input = input("bus: ")
    response = requests.get(domain + "/api/buses/get/" + bus_input)
    print(json.dumps(json.loads(response.text), indent=4, sort_keys=4))
    if (response.status_code != 200):
        exit()
    data["bus_id"] = json.loads(response.text)["_id"]
    res = update_route(data)
    if not res["status"]:
        exit()
    data = res["data"]
    get_radius_stops(data["route_id"])
    data["proc"] = Process(target=frame, args=(json.loads(response.text)["_id"],))
    data["proc"].start()
    root = Root()
    root.state = State_api()
    root.route = Route_api()
    root.points = Point_api()
    root.update = Update_api()
    cherrypy.quickstart(root, config=config)
    data["proc"].join()
