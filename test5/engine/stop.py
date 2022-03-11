#!/usr/bin/python3
"""
    module
"""
from mongoengine import connect, Document, StringField, ListField, ObjectIdField, PointField
from engine.route import Route

DB_URL = 'mongodb+srv://db:test1@cluster0.kw6z7.mongodb.net/api?retryWrites=true&w=majority&ssl=true'


connect(host=DB_URL)

class Stop(Document):
    position = PointField(required=True)
    routes = ListField(ObjectIdField())
    content = StringField()
    meta = {
        'collection': 'Stop'
    }

    def to_json(self):
        """Convert this document to json"""
        return {
            "position": self.position,
            "routes": self.routes,
            "content": self.content
        }