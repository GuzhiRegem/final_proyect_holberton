#!/usr/bin/python3
"""
    module
"""
from mongoengine import connect, Document, StringField, ListField, ObjectIdField, PointField
import json

class Stop(Document):
    position = PointField(required=True)
    routes = ListField(ObjectIdField())
    content = StringField()

    def to_dict(self):
        out = json.loads(self.to_json())
        out["_id"] = out["_id"]["$oid"]
        for idx in range(len(out["routes"])):
            out["routes"][idx] = out["routes"][idx]["$oid"]
        return out
