#!/usr/bin/python3
"""
    api route
"""



from urllib import response
from flask import Flask, Response, jsonify, make_response, request
from test5.engine.route import Route
from flask_pymongo import PyMongo
import pymongo
from bson.objectid import ObjectId

myclient = pymongo.MongoClient("mongodb+srv://db:test1@cluster0.kw6z7.mongodb.net/")
mydb = myclient["api"]
mycol = mydb["Route"]

app = Flask(__name__)
app.config['MONGO_URI']='mongodb+srv://db:test1@cluster0.kw6z7.mongodb.net/'
mongo = PyMongo(app)
@app.route('/api/getroutes', methods=['GET'])
def getall():
    #get all routes
    routes = []
    for obj in mycol.objects:
        routes.append(obj.to_json())
    return Response(routes, mimetype="application/json", status=200)

@app.route('/api/createroute', methods=['POST'])
def create_route():
    """create a route"""
    res = request.json
    if "owner" not in res:
        return "owner"
    if "name" not in res:
        return "owner"
    if "points" not in res:
        return "owner"
    if "stops" not in res:
        return "owner"
    mycol.insert_one(
        {'owner': owner, "name": name,
        "points": points, "stops": stops}
    )
    return make_response("", 201)


@app.route('/api/editroute/<id>/<content>', methods=['PUT'])
def editpoint(id, owner=None, x=None, y=None, content=None):
    """edit a route"""
    pass


@app.route('/api/deletesroutes', methods=['DELETE'])
def deletesall():
    """delete route"""
    mycol.delete_many({})
    return make_response("", 200)


@app.route('/api/deleteroute/<id>', methods=['DELETE'])
def deleteonepoint(id):
    """delete route"""
    mycol.delete_one({'_id': ObjectId(id)})
    return make_response("", 200)

if __name__ == '__main__':
    app.run()
