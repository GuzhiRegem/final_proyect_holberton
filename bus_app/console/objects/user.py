#!/usr/bin/python3
"""
    module
"""
from enum import unique
from mongoengine import connect, Document, StringField, ListField, ObjectIdField, UUIDField
import json
import uuid

class User(Document):
    username = StringField(required=True, unique=True, null=False)
    name = StringField(required=True, null=False)
    password = StringField(required=True, null=False)
    email = StringField(required=True, unique=True, null=False)
    routes = ListField(ObjectIdField())
    points = ListField(ObjectIdField())
    buses = ListField(ObjectIdField())
    read_token = UUIDField(default=uuid.uuid1())
    write_token = UUIDField(default=uuid.uuid1())

    def to_dict(self):
        out = json.loads(self.to_json())
        out["_id"] = out["_id"]["$oid"]
        out["read_token"] = out["read_token"]["$uuid"]
        out["write_token"] = out["write_token"]["$uuid"]
        for idx in range(len(out["routes"])):
            out["routes"][idx] = out["routes"][idx]["$oid"]
        for idx in range(len(out["buses"])):
            out["buses"][idx] = out["buses"][idx]["$oid"]
        for idx in range(len(out["points"])):
            out["points"][idx] = out["points"][idx]["$oid"]
        return out

class UnconfirmedUser(Document):
    username = StringField(required=True, unique=True, null=False)
    name = StringField(required=True, null=False)
    password = StringField(required=True, null=False)
    email = StringField(required=True, unique=True, null=False)
    routes = ListField(ObjectIdField())
    points = ListField(ObjectIdField())
    buses = ListField(StringField())
    read_token = UUIDField(default=uuid.uuid1())
    write_token = UUIDField(default=uuid.uuid1())

    def to_dict(self):
        out = json.loads(self.to_json())
        out["_id"] = out["_id"]["$oid"]
        return out
