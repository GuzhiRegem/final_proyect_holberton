#!/usr/bin/python3
"""
    module
"""
from engine.user import User
from engine.route import Route
from engine.point import Point
from engine.stop import Stop
from engine.bus import Bus
from mongoengine import connect
connect('test_db')

class Storage:
    classes = {
        "user": User,
        "route": Route,
        "point": Point,
        "stop": Stop,
        "bus": Bus
    }
    
    def all(self, cls=None):
        out = []
        if cls is None:
            for key, value in self.classes.items():
                for obj in value.objects:
                    out.append(obj)
            return out
        sel_cls = self.classes.get(cls)
        if sel_cls is None:
            return out
        for obj in sel_cls.objects:
            out.append(obj)
        return obj

    def add(self, cls, dic):
        new = self.classes[cls](**dic)
        new.save()
        return new

    def radius(self, x, y, radius):
        out = []
        for obj in Point.objects(position__geo_within_center=[[x, y],radius]):
            out.append(obj)
        for obj in Stop.objects(position__geo_within_center=[[x, y],radius]):
            out.append(obj)
        return out
