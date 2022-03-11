#!/usr/bin/python3
"""
    api user
"""



from flask import Flask, Response, make_response, request
import pymongo
from bson.objectid import ObjectId

myclient = pymongo.MongoClient("mongodb+srv://db:test1@cluster0.kw6z7.mongodb.net/")
mydb = myclient["api"]
mycol = mydb["User"]

app = Flask(__name__)

@app.route('/api/users', methods=['GET'])
def getall():
    """get all users"""
    points = mycol.objects().to_json()
    return Response(points, mimetype="application/json", status=200)

@app.route('/api/users/<username>', methods=['GET'])
def getone():
    """Get a specific user"""
    pass

@app.route('/api/users/<username>/routes', methods=['GET'])
def get_user_route():
    """Gets a user’s route"""
    pass

@app.route('/api/users/<username>/buses', methods=['GET'])
def get_user_bus():
    """Gets a user’s buses"""
    pass

@app.route('/api/users/<username>/points', methods=['GET'])
def get_user_point():
    """Gets a user’s points"""
    pass

@app.route('/api/createuser', methods=['POST'])
def create():
    """Create a user"""
    pass

@app.route('/api/edituser', methods=['PUT'])
def edit():
    """Edit a specific user"""
    pass

@app.route('/api/deleteuser/<id>', methods=['DELETE'])
def delete(id):
    """delete user"""
    mycol.delete_one({'_id': ObjectId(id)})
    return make_response("", 200)

if __name__ == '__main__':
    app.run()