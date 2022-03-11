#!/usr/bin/python3
"""
    module
"""
from mongoengine import connect, Document, StringField, ListField, ObjectIdField, PointField

DB_URL = 'mongodb+srv://db:test1@cluster0.kw6z7.mongodb.net/api?retryWrites=true&w=majority&ssl=true'


connect(host=DB_URL)

class Point(Document):
    _id = None
    owner = StringField(required=True)
    position = PointField(required=True)
    content = StringField()
    meta = {
        'collection': 'Point'
    }

    def to_json(self):
        """Convert this document to json"""
        return {
            "owner": self.owner,
            "position": self.position,
            "content": self.content
        }