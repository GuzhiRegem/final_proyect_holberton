#!/usr/bin/python3
"""    
    module
    return: clear
"""
from email import message
import re
from sqlite3 import connect
from flask_cors import CORS
from flask import Flask, jsonify, make_response, request
app = Flask(__name__)
app.url_map.strict_slashes = False
cors = CORS(app, resources={r"/*": {"origins": "*"}})
from mongoengine import *
connect('testdb2')
from objects.bus import Bus
from objects.point import Point
from objects.route import Route
from objects.stop import Stop
from objects.user import User, UnconfirmedUser
import uuid
from hashlib import sha256
import re
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
admin_key = "hola"
domain = "35.237.138.76"

def send_email(receiver, message):
    try:
        smtp = smtplib.SMTP(host='smtp.office365.com', port=587)
        smtp.ehlo()
        smtp.starttls()
        EMAIL_ADDRESS = 'tourmeuy@outlook.com'
        EMAIL_PASSWORD = 'tourme2022'
        msg = MIMEMultipart()
        msg['Subject'] = 'Tour-Me confirmation email'
        msg['From'] = EMAIL_ADDRESS 
        msg['To'] = receiver
        msg.attach(MIMEText('link: {}'.format(message), 'plain'))
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD) 
        smtp.send_message(msg)
        return True
    except Exception as e:
        print(e)
        return False


@app.route('/api/all')
def get_all():
    if request.headers.get("admin_key") != admin_key:
        return "invalid key", 400
    out = []
    for cls in [Bus, Point, Route, Stop, User]:
        for obj in cls.objects:
            out.append(obj.to_dict())
    return jsonify(out), 200, {'ContentType':'application/json'}

@app.route("/api/get/<id>", methods=['GET'])
def get_one(id):
    if request.headers.get("admin_key") != admin_key:
        return "invalid key"
    for cls in [Bus, Point, Route, Stop, User]:
        try:
            found = cls.objects(pk=id)
            if len(found) > 0:
                return jsonify(found.first().to_dict()), 200, {'ContentType':'application/json'}
        except Exception as e:
            return str(e), 400
    return jsonify({}) , 200, {'ContentType':'application/json'}


# stop

@app.route("/api/stops", methods=['GET'])
def get_stops():
    out = []
    for obj in Stop.objects:
        out.append(obj.to_dict())
    return jsonify(out), 200, {'ContentType':'application/json'}

@app.route("/api/stops/get/<id>", methods=['GET'])
def get_stop(id):
    try:
        u_list = Stop.objects(pk=id)
        if len(u_list) == 0:
            return "not found", 400
        obj = u_list.first()
        return jsonify(obj.to_dict()), 200, {'ContentType':'application/json'}
    except Exception as e:
        return str(e), 400

@app.route("/api/stops/radius/<x>/<y>/<radius>", methods=['GET'])
def get_stops_radius(x, y, radius):
    out = []
    for obj in Stop.objects(position__geo_within_center=[(float(x), float(y)), float(radius)]):
        out.append(obj.to_dict())
    return jsonify(out), 200, {'ContentType':'application/json'}

@app.route("/api/stops/add", methods=['POST'])
def add_stop():
    if request.headers.get("admin_key") != admin_key:
        return "invalid key", 400
    try:
        new = Stop(**request.json)
        new.save()
    except Exception as e:
        return str(e), 400
    return jsonify(new.to_dict()), 200, {'ContentType':'application/json'}

@app.route("/api/stops/edit/<id>", methods=['PUT'])
def edit_stop(id):
    if request.headers.get("admin_key") != admin_key:
        return "invalid key", 400
    try:
        found_list = Stop.objects(pk=id)
        if len(found_list) <= 0:
            return "not found", 400
        obj = found_list.first()
        lis = request.json
        for key, value in lis.items():
            obj.update(**{"set__{}".format(key):value})
        return "done", 200, {'ContentType':'application/json'}
    except Exception as e:
        return str(e), 400

@app.route("/api/stops/delete/<id>", methods=['DELETE'])
def delete_stop(id):
    if request.headers.get("admin_key") != admin_key:
        return "invalid key", 400
    try:
        found_list = Stop.objects(pk=id)
        if len(found_list) <= 0:
            return "not found", 400
        found_list.delete()
        return "done", 200, {'ContentType':'application/json'}
    except Exception as e:
        return str(e), 400

# Users

@app.route("/api/users", methods=['GET'])
def get_users():
    out = []
    for obj in User.objects:
        dic = obj.to_dict()
        add = {
            "_id": dic["_id"],
            "username": dic["username"],
            "name": dic["name"]
        }
        out.append(add)
    return jsonify(out), 200, {'ContentType':'application/json'}


@app.route("/api/users/add", methods=['POST'])
def add_user():
    try:
        req = request.json
        if ("username" not in req) or ("username" not in req) or ("email" not in req) or ("password" not in req):
            return "requred: username, password, email and password", 400
        found_list = User.objects(username__exact=req["username"])
        if len(found_list) >= 1:
            return "username in use", 400
        found_list = User.objects(email__exact=req["email"])
        if len(found_list) >= 1:
            return "email in use", 400
        user_regex = r'[a-zA-Z0-9._@]+'
        if not re.fullmatch(user_regex, req["username"]):
            return "invlid email", 400
        email_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        if not re.fullmatch(email_regex, req["email"]):
            return "invlid email", 400
        password_regex = r'(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\!\@\#\$\%\(\)\-\_\+\.\,]).{8,}'
        if not re.fullmatch(password_regex, req["password"]):
            return "password must be 8 characters(min) and contain at least: uppercase, lowercase, number and special char: !@#$%()-_+.,", 400
        found_list = UnconfirmedUser.objects(username__exact=req["username"])
        if len(found_list) >= 1:
            return "account already registered", 400
        req["password"] = sha256("{}{}".format(req["password"], req["username"]).encode('utf-8')).hexdigest()
        new = UnconfirmedUser(**req)
        new.save()
        message = "{}:5001/api/confirm_user/{}".format(domain, new.to_dict()["_id"])
        if (send_email(req["email"], message)):
            return "verification email sent to {}".format(req["email"]), 200
        new.delete()
        return "error sending email", 400
    except Exception as e:
        return str(e), 400

@app.route("/api/confirm_user/<id>", methods=['GET'])
def confirm_user(id):
    try:
        found_list = UnconfirmedUser.objects(pk=id)
        if len(found_list) <= 0:
            return "not found", 400
        obj = found_list.first()
        dic = obj.to_dict()
        obj.delete()
        del dic["_id"]
        dic["read_token"] = uuid.uuid4()
        dic["write_token"] = uuid.uuid4()
        new = User(**dic)
        new.save()
        return jsonify(new.to_dict())
    except Exception as e:
        return str(e), 400

@app.route("/api/get_tokens", methods=['POST'])
def get_tokens():
    try:
        req = request.json
        if ("username" not in req) or ("username" not in req):
            return "requred: username and password", 400
        found_list = User.objects(username__exact=req["username"])
        if len(found_list) <= 0:
            return "user not found", 400
        obj = found_list.first().to_dict()
        req["password"] = sha256("{}{}".format(req["password"], req["username"]).encode('utf-8')).hexdigest()
        if (obj["password"] != req["password"]):
            return "wrong password", 400
        out = {
            "_id": obj["_id"],
            "read_token": obj["read_token"],
            "write_token": obj["write_token"]
        }
        return out, 200, {'ContentType':'application/json'}
    except Exception as e:
        return str(e), 404

@app.route("/api/users/<username>", methods=['GET'])
def get_username(username):
    try:
        found_list = User.objects(username__exact=username)
        if len(found_list) <= 0:
            return "not found", 400
        obj = found_list.first().to_dict()
        if request.headers.get("token") == obj["read_token"]:
            return jsonify(obj), 200
        out = {
            "_id": obj["_id"],
            "username": obj["username"],
            "name": obj["name"]
        }
        return jsonify(out), 200, {'ContentType':'application/json'}
    except Exception as e:
        return str(e), 400

@app.route("/api/users/<username>/routes", methods=['GET'])
def get_username_routes(username):
    try:
        found_list = User.objects(username__exact=username)
        if len(found_list) <= 0:
            return "not found", 400
        obj = found_list.first()
        routelist = Route.objects(owner=obj['id'])
        out = []
        for route in routelist:
            out.append(route.to_dict())
        return jsonify(out), 200, {'ContentType':'application/json'}
    except Exception as e:
        return str(e), 400

@app.route("/api/users/<username>/points", methods=['GET'])
def get_username_points(username):
    try:
        found_list = User.objects(username__exact=username)
        if len(found_list) <= 0:
            return "not found", 400
        obj = found_list.first()
        routelist = Point.objects(owner=obj['id'])
        out = []
        for route in routelist:
            out.append(route.to_dict())
        return jsonify(out), 200, {'ContentType':'application/json'}
    except Exception as e:
        return str(e), 400

@app.route("/api/users/<username>/buses", methods=['GET'])
def get_username_buses(username):
    try:
        found_list = User.objects(username__exact=username)
        if len(found_list) <= 0:
            return "not found", 400
        u_obj = found_list.first()
        routelist = Bus.objects(owner=u_obj['id'])
        out = []
        for route in routelist:
            obj = route.to_dict()
            if request.headers.get("token") != u_obj.to_dict()["read_token"]:
                del obj["admin_key"]
            out.append(obj)
        return jsonify(out), 200, {'ContentType':'application/json'}
    except Exception as e:
        return str(e), 400

@app.route("/api/users/edit/<id>", methods=['PUT'])
def edit_user(id):
    try:
        found_list = User.objects(pk=id)
        if len(found_list) <= 0:
            return "not found", 400
        obj = found_list.first()
        if request.headers.get("token") != obj["write_token"]:
            return "invalid write_token", 400
        lis = request.json
        for key, value in lis.items():
            obj.update(**{"set__{}".format(key):value})
        return "done", 200, {'ContentType':'application/json'}
    except Exception as e:
        return str(e), 400

@app.route("/api/users/delete/<id>", methods=['DELETE'])
def delete_user(id):
    try:
        found_list = User.objects(pk=id)
        if len(found_list) <= 0:
            return "not found", 400
        obj = found_list.first()
        if request.headers.get("token") != obj.to_dict()["write_token"]:
            return "invalid write_token", 400
        dic = obj.to_dict()
        points = Point.objects(owner=dic["_id"])
        routes = Route.objects(owner=dic["_id"])
        buses = Bus.objects(owner=dic["_id"])
        for obj in points:
            obj.delete()
        for obj in routes:
            obj.delete()
        for obj in buses:
            obj.delete()
        obj.delete()
        return "done", 200, {'ContentType':'application/json'}
    except Exception as e:
        return str(e), 400

# routes

@app.route("/api/routes", methods=['GET'])
def get_routes():
    out = []
    for obj in Route.objects:
        out.append(obj.to_dict())
    return jsonify(out), 200

@app.route("/api/routes/get/<id>", methods=['GET'])
def get_route(id):
    try:
        u_list = Route.objects(pk=id)
        if len(u_list) == 0:
            return "not found", 400
        obj = u_list.first()
        return jsonify(obj.to_dict()), 200
    except Exception as e:
        return str(e), 400

@app.route("/api/routes/data/<id>", methods=['GET'])
def data_route(id):
    try:
        u_list = Route.objects(pk=id)
        if len(u_list) == 0:
            return "not found", 400
        obj = u_list.first().to_dict()
        out = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": obj["points"]
                }
            ]
        }
        for stop in obj["stops"]:
            s_list = Stop.objects(pk=stop)
            if len(s_list) == 0:
                continue
            tmp = s_list.first().to_dict()
            out["features"].append({
                "type": "Feature",
                "properties": {
                    "_id": tmp["_id"]
                },
                "geometry": tmp["position"]
            })
        return jsonify(out), 200
    except Exception as e:
        return str(e), 400

@app.route("/api/routes/points/<id>", methods=['GET'])
def update_route(id):
    try:
        u_list = Route.objects(pk=id)
        if len(u_list) == 0:
            return "not found", 400
        obj = u_list.first().to_dict()
        out = []
        for stop_id in obj["stops"]:
            s_list = Stop.objects(pk=stop_id)
            if len(s_list) == 0:
                continue
            stop = s_list.first().to_dict()
            pos = stop["position"]["coordinates"]
            rad = Point.objects(position__geo_within_center=[(pos[0], pos[1]), 0.3])
            for point in rad:
                out.append(point.to_dict())
        return jsonify(out), 200
    except Exception as e:
        return str(e), 400
    

@app.route("/api/routes/add", methods=['POST'])
def add_routes():
    try:
        req = request.json
        u_list = User.objects(pk=req["owner"])
        if len(u_list) == 0:
            return "user not found", 400
        user_obj = u_list.first()
        if request.headers.get("token") != user_obj.to_dict()["write_token"]:
            return "invalid key", 400
        new = Route(**request.json)
        new.save()
        user_obj.routes.append(new.to_dict()["_id"])
        user_obj.save()
    except Exception as e:
        return str(e), 400
    return jsonify(new.to_dict()), 200, {'ContentType':'application/json'}

@app.route("/api/routes/edit/<id>", methods=['PUT'])
def edit_routes(id):
    try:
        found_list = Route.objects(pk=id)
        if len(found_list) <= 0:
            return "route not found", 400
        obj = found_list.first()
        lis = request.json
        u_list = User.objects(pk=obj.to_dict()["owner"])
        if len(u_list) == 0:
            return "user not found", 400
        user_obj = u_list.first()
        if request.headers.get("token") != user_obj.to_dict()["write_token"]:
            return "invalid key", 400
        for key, value in lis.items():
            if "key" != "owner":
                obj.update(**{"set__{}".format(key):value})
        return "done", 200, {'ContentType':'application/json'}
    except Exception as e:
        return str(e), 400

@app.route("/api/routes/delete/<id>", methods=['DELETE'])
def delete_routes(id):
    try:
        found_list = Route.objects(pk=id)
        if len(found_list) <= 0:
            return "not found", 400
        found_obj = found_list.first()
        u_list = User.objects(pk=found_obj.to_dict()["owner"])
        if len(u_list) == 0:
            return "user not found", 400
        user_obj = u_list.first()
        if request.headers.get("token") != user_obj.to_dict()["write_token"]:
            return "invalid key", 400
        user_obj.update(pull__routes=found_obj["id"])
        found_obj.delete()
        return "done", 200, {'ContentType':'application/json'}
    except Exception as e:
        return str(e), 400

# point

@app.route("/api/points", methods=['GET'])
def get_points():
    out = []
    for obj in Point.objects:
        out.append(obj.to_dict())
    return jsonify(out), 200, {'ContentType':'application/json'}

@app.route("/api/points/get/<id>", methods=['GET'])
def get_point(id):
    try:
        u_list = Point.objects(pk=id)
        if len(u_list) == 0:
            return "not found", 400
        obj = u_list.first()
        return jsonify(obj.to_dict()), 200, {'ContentType':'application/json'}
    except Exception as e:
        return str(e), 400

@app.route("/api/points/radius/<x>/<y>/<radius>", methods=['GET'])
def get_points_radius(x, y, radius):
    try:
        out = []
        for obj in Point.objects(position__geo_within_center=[(float(x), float(y)), float(radius)]):
            out.append(obj.to_dict())
        return jsonify(out), 200, {'ContentType':'application/json'}
    except Exception as e:
        return str(e)

@app.route("/api/points/add", methods=['POST'])
def add_points():
    try:
        req = request.json
        u_list = User.objects(pk=req["owner"])
        if len(u_list) == 0:
            return "user not found", 400
        user_obj = u_list.first()
        if request.headers.get("token") != user_obj.to_dict()["write_token"]:
            return "invalid key", 400
        new = Point(**request.json)
        new.save()
        user_obj.points.append(new.to_dict()["_id"])
        user_obj.save()
    except Exception as e:
        return str(e), 400
    return jsonify(new.to_dict()), 200, {'ContentType':'application/json'}

@app.route("/api/points/edit/<id>", methods=['PUT'])
def edit_points(id):
    try:
        found_list = Point.objects(pk=id)
        if len(found_list) <= 0:
            return "route not found", 400
        obj = found_list.first()
        lis = request.json
        u_list = User.objects(pk=obj.to_dict()["owner"])
        if len(u_list) == 0:
            return "user not found", 400
        user_obj = u_list.first()
        if request.headers.get("token") != user_obj.to_dict()["write_token"]:
            return "invalid key", 400
        for key, value in lis.items():
            if key != "owner":
                obj.update(**{"set__{}".format(key):value})
        return "done", 200, {'ContentType':'application/json'}
    except Exception as e:
        return str(e), 400

@app.route("/api/points/delete/<id>", methods=['DELETE'])
def delete_points(id):
    try:
        found_list = Point.objects(pk=id)
        if len(found_list) <= 0:
            return "not found", 400
        found_obj = found_list.first()
        u_list = User.objects(pk=found_obj.to_dict()["owner"])
        if len(u_list) == 0:
            return "user not found", 400
        user_obj = u_list.first()
        if request.headers.get("token") != user_obj.to_dict()["write_token"]:
            return "invalid key", 400
        user_obj.update(pull__points=found_obj["id"])
        found_obj.delete()
        return "done", 200, {'ContentType':'application/json'}
    except Exception as e:
        return str(e), 400

# bus

@app.route("/api/buses", methods=['GET'])
def get_buses():
    out = []
    for obj in Bus.objects:
        dic = obj.to_dict()
        del dic["admin_key"]
        out.append(dic)
    return jsonify(out), 200, {'ContentType':'application/json'}

@app.route("/api/buses/add", methods=['POST'])
def add_buses():
    try:
        req = request.json
        u_list = User.objects(pk=req["owner"])
        if len(u_list) == 0:
            return "user not found", 400
        user_obj = u_list.first()
        if request.headers.get("token") != user_obj.to_dict()["write_token"]:
            return "invalid key", 400
        l_list = Route.objects(pk=req["route"])
        if len(l_list) == 0:
            return "route not found", 400
        new = Bus(**request.json)
        new.save()
        user_obj.buses.append(new.to_dict()["_id"])
        user_obj.save()
    except Exception as e:
        return str(e), 400
    return jsonify(new.to_dict()), 200, {'ContentType':'application/json'}

@app.route("/api/buses/edit/<id>", methods=['PUT'])
def edit_buses(id):
    try:
        found_list = Bus.objects(pk=id)
        if len(found_list) <= 0:
            return "bus not found", 400
        obj = found_list.first()
        lis = request.json
        u_list = User.objects(pk=obj.to_dict()["owner"])
        if len(u_list) == 0:
            return "user not found", 400
        user_obj = u_list.first()
        if "route" in lis:
            l_list = Route.objects(pk=lis["route"])
            if len(l_list) == 0:
                return "route not found", 400
        auth = 0
        if request.headers.get("bus_key") != obj.to_dict()["admin_key"]:
            auth = 1
            if request.headers.get("token") != user_obj.to_dict()["write_token"]:
                return "invalid key", 400
        for key, value in lis.items():
            if key != "owner" and not (key == "admin_key" and auth == 0):
                obj.update(**{"set__{}".format(key):value})
        return "done", 200, {'ContentType':'application/json'}
    except Exception as e:
        return str(e), 400

@app.route("/api/buses/delete/<id>", methods=['DELETE'])
def delete_buses(id):
    try:
        found_list = Bus.objects(pk=id)
        if len(found_list) <= 0:
            return "not found", 400
        found_obj = found_list.first()
        u_list = User.objects(pk=found_obj.to_dict()["owner"])
        if len(u_list) == 0:
            return "user not found", 400
        user_obj = u_list.first()
        if request.headers.get("token") != user_obj.to_dict()["write_token"]:
            return "invalid key", 400
        user_obj.update(pull__buses=found_obj["id"])
        found_obj.delete()
        return "done", 200, {'ContentType':'application/json'}
    except Exception as e:
        return str(e), 400

@app.route("/api/buses/get/<id>", methods=['GET'])
def get_bus(id):
    try:
        b_list = Bus.objects(pk=id)
        if len(b_list) == 0:
            return "not found", 400
        obj = b_list.first().to_dict()
        u_list = User.objects(pk=obj["owner"])
        if len(u_list) == 0:
            return "user not found", 400
        user_obj = u_list.first()
        if request.headers.get("bus_key") != obj["admin_key"]:
            if request.headers.get("token") != user_obj.to_dict()["read_token"]:
                del obj["admin_key"]
        return jsonify(obj), 200, {'ContentType':'application/json'}
    except Exception as e:
        return str(e), 400

if __name__ == "__main__":
    app.run()
