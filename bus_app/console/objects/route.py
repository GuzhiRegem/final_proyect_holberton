#!/usr/bin/python3
"""
    module
"""
from mongoengine import connect, Document, StringField, ListField, ObjectIdField, LineStringField
import json

class Route(Document):
    owner = ObjectIdField(required=True)
    name = StringField(required=True, null=False)
    points = LineStringField(required=True)
    stops = ListField(ObjectIdField())

    def to_dict(self):
        out = json.loads(self.to_json())
        out["_id"] = out["_id"]["$oid"]
        out["owner"] = out["owner"]["$oid"]
        for idx in range(len(out["stops"])):
            out["stops"][idx] = out["stops"][idx]["$oid"]
        return out
