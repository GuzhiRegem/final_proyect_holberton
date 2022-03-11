#!/usr/bin/python3
"""
    api stop
"""



from flask import Flask, Response, make_response, request
import pymongo
from bson.objectid import ObjectId

myclient = pymongo.MongoClient("mongodb+srv://db:test1@cluster0.kw6z7.mongodb.net/")
mydb = myclient["api"]
mycol = mydb["Stop"]

app = Flask(__name__)

@app.route('/api/getallstops', methods=['GET'])
def getall():
    """get all stops"""
    points = mycol.objects().to_json()
    return Response(points, mimetype="application/json", status=200)


@app.route('/api/createstops', methods=['POST'])
def create():
    """create stops"""
    pass


@app.route('/api/editstops', methods=['PUT'])
def edit():
    """edit stop"""
    pass


@app.route('/api/deletestop/<id>', methods=['DELETE'])
def delete(id):
    """delete stop"""
    mycol.delete_one({'_id': ObjectId(id)})
    return make_response("", 200)

if __name__ == '__main__':
    app.run()