#!/usr/bin/python3
"""
    api point
"""


from flask import Flask, Response, make_response, request
from test5.engine.point import Point
import pymongo
from flask_pymongo import PyMongo
from bson.objectid import ObjectId

myclient = pymongo.MongoClient("mongodb+srv://db:test1@cluster0.kw6z7.mongodb.net/")
mydb = myclient["api"]
mycol = mydb["Point"]

app = Flask(__name__)
app.config['MONGO_URI']='mongodb+srv://db:test1@cluster0.kw6z7.mongodb.net/'
mongo = PyMongo(app)

@app.route('/api/getpoints', methods=['GET'])
def getall():
    """get all points"""
    points = mycol.objects().to_json()
    return Response(points, mimetype="application/json", status=200)

@app.route('/api/createpoint/<owner>/<int:x>/<int:y>/<content>', methods=['POST'])
def createpoint(owner, x, y, content):
    """create a point"""
    point = Point(owner = owner, position =  {'type' : 'Point' ,
 'coordinates' : [x, y]},content= content)
    point.save()
    return make_response("", 201)
"""

@app.route('/api/createpoint', methods=['POST'])
def createpoint():
    """"""create a point""""""
    owner = request.json['owner']
    position = request.json['position']
    content = request.json['content']
    if owner and position and content:
        mongo.db.Point.insert_one(
            {'owner': owner,
            "position": position,
            "content": content}
        )
    return make_response("", 201)
"""
@app.route('/api/editpoint/<id>/<content>', methods=['PUT'])
def editpoint(id, owner=None, x=None, y=None, content=None):
    """edit a point"""
    mycol.find_one_and_update({ '_id': ObjectId(id)}, {"$set": {"content": content}})
    return make_response("", 201)


@app.route('/api/deletespoints', methods=['DELETE'])
def deletesall():
    """delete points"""
    mycol.delete_many({})
    return make_response("", 200)


@app.route('/api/deletepoint/<id>', methods=['DELETE'])
def deleteonepoint(id):
    """delete points"""
    mycol.delete_one({'_id': ObjectId(id)})
    return make_response("", 200)

if __name__ == '__main__':
    app.run()