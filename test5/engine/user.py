#!/usr/bin/python3
"""
    module
"""
from mongoengine import connect, Document, StringField, ListField, ObjectIdField
from mongoengine.context_managers import switch_collection

DB_URL = 'mongodb+srv://db:test1@cluster0.kw6z7.mongodb.net/api?retryWrites=true&w=majority&ssl=true'


connect(host=DB_URL)

class User(Document):
    username = StringField(required=True)
    name = StringField(required=True)
    password = StringField(required=True)
    routes = ListField(ObjectIdField())
    points = ListField(ObjectIdField())
    buses = ListField(StringField())
    meta = {
        'collection': 'User'
    }

    def to_json(self):
        """Convert this document to json"""
        return {
            "username": self.username,
            "name": self.name,
            "password": self.password,
            "routes": self.routes,
            "points": self.points,
            "buses": self.buses
        }