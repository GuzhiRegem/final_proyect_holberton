#!/usr/bin/python3
"""
    api bus
"""



from flask import Flask, Response, make_response, request
import pymongo
from bson.objectid import ObjectId

myclient = pymongo.MongoClient("mongodb+srv://db:test1@cluster0.kw6z7.mongodb.net/")
mydb = myclient["api"]
mycol = mydb["Bus"]

app = Flask(__name__)

@app.route('/api/getallbuses', methods=['GET'])
def getall():
    """get all buses"""
    points = mycol.objects().to_json()
    return Response(points, mimetype="application/json", status=200)

@app.route('/api/getonebus', methods=['GET'])
def getone():
    """get a bus"""
    pass

@app.route('/api/createbus', methods=['POST'])
def create():
    """create bus"""
    pass


@app.route('/api/editbus', methods=['PUT'])
def edit():
    """edit bus"""
    pass


@app.route('/api/deletebus/<id>', methods=['DELETE'])
def delete(id):
    """delete bus"""
    mycol.delete_one({'_id': ObjectId(id)})
    return make_response("", 200)

if __name__ == '__main__':
    app.run()