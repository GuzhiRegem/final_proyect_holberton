#!/usr/bin/python3
"""Start link class to table in database 
"""

from test3.point import Point, Base
from sys import argv

from sqlalchemy import (create_engine)
from sqlalchemy.orm import Session
from sqlalchemy.sql import select


class Storage():
    def __init__(self) -> None:
        self.__engine = create_engine('mysql+mysqldb://devuser:devpass@localhost/test_db', pool_pre_ping=True)
        Base.metadata.create_all(self.__engine)
        self.__session = Session(self.__engine)
    
    @property
    def engine(self):
        return self.__engine

    def all(self):
        session = self.__session
        Base.metadata.create_all(self.__engine)
        points = session.query(Point).order_by(Point.id).all()
        return points
    
    def delete_point(self, x, y):
        session = self.__session
        for point in session.query(Point).filter(Point.x == x and Point.y == y):
            session.delete(point)

    def add_point(self, x, y, name, content=None):
        session = self.__session
        new_point = Point(x=x, y=y, name=name, content=content)
        session.add(new_point)
        session.commit()
        return new_point
    
    def save(self):
        session = self.__session
        session.commit()
    
    def close(self):
        self.__session.close()
    
    def get_radius(self, radius, x, y):
        session = self.__session
        points = session.query(Point).order_by(Point.id).filter((Point.x <= (x + radius)), (Point.x >= (x - radius)), (Point.y <= (y + radius)), (Point.y >= (y - radius)))
        return points
    
    def drop(self):
        session = self.__session
        points = session.query(Point).order_by(Point.id).all()
        for point in points:
            session.delete(point)
        session.commit()
