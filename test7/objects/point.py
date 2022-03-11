#!/usr/bin/python3
"""
    module
"""
from mongoengine import connect, Document, StringField, ListField, ObjectIdField, PointField
import json

class Point(Document):
    owner = ObjectIdField(required=True)
    position = PointField(required=True)
    content = StringField()

    def to_dict(self):
        out = json.loads(self.to_json())
        out["_id"] = out["_id"]["$oid"]
        out["owner"] = out["owner"]["$oid"]
        return out
