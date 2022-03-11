#!/usr/bin/python3
"""
    module
"""
from mongoengine import connect, Document, StringField, ListField, ObjectIdField, LineStringField
#from engine.user import User
DB_URL = 'mongodb+srv://db:test1@cluster0.kw6z7.mongodb.net/api?retryWrites=true&w=majority&ssl=true'


connect(host=DB_URL)


class Route(Document):
    owner = ObjectIdField(required=True)
    name = StringField(required=True)
    points = LineStringField(required=True)
    stops = ListField(StringField())
    meta = {
        'collection': 'Route'
    }

    def to_json(self):
        """Convert this document to json"""
        return {
            "owner": self.owner,
            "name": self.name,
            "points": self.points,
            "stops": self.stops
        }