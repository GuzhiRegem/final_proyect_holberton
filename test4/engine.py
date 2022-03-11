#!/usr/bin/python3
from pymongo import MongoClient
from bson.objectid import ObjectId
client = MongoClient()
db = client.test_database

class Storage:
    def __init__(self):
        self.__client = MongoClient()
        self.__db = client.test_database

    def add_user(self, username, key):
        dic = {
            "username": username,
            "key": key,
            "email": "",
            "name": "",
            "routes": []
        }
        new = self.__db.users.insert_one(dic)
        return new
    
    def find_user(self, id):
        out = self.__db.users.find_one({"_id":ObjectId(id)})
        return out
    
    def add_route(self, id, coords):
        dic = {
            "owner": ObjectId(id),
            "points": coords
        }
        new = self.__db.routes.insert_one(dic)
        self.__db.users.update_one({"_id":ObjectId(id)}, {"$push": {"routes": ObjectId(new.inserted_id)}}, True)
        return new
