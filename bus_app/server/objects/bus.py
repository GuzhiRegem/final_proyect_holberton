#!/usr/bin/python3
"""
    module
"""
from mongoengine import connect, Document, StringField, ListField, ObjectIdField
import json

class Bus(Document):
    owner = ObjectIdField(required=True)
    route = ObjectIdField(required=True)
    wifi_name = StringField(required=True, null=False)
    admin_key = StringField(required=True, null=False)

    def to_dict(self):
        out = json.loads(self.to_json())
        out["_id"] = out["_id"]["$oid"]
        out["owner"] = out["owner"]["$oid"]
        out["route"] = out["route"]["$oid"]
        return out
