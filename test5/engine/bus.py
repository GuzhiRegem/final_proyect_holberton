#!/usr/bin/python3
"""
    module
"""
from mongoengine import connect, Document, StringField, ListField, ObjectIdField
from engine.user import User
from engine.route import Route

DB_URL = 'mongodb+srv://db:test1@cluster0.kw6z7.mongodb.net/api?retryWrites=true&w=majority&ssl=true'


connect(host=DB_URL)

class Bus(Document):
    owner = ObjectIdField(required=True)
    route = ObjectIdField(required=True)
    wifi_name = StringField(required=True)
    admin_key = StringField(required=True)
    link = StringField(required=True)
    meta = {
        'collection': 'Bus'
    }

    def to_json(self):
        """Convert this document to json"""
        return {
            "owner": self.owner,
            "route": self.route,
            "wifi_name": self.wifi_name,
            "admin_key": self.admin_key,
            "link": self.link
        }