#!/usr/bin/python3
"""
    point
"""
from sqlalchemy import Column, Integer, Float, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Point(Base):
    ''' State '''
    __tablename__ = 'points'
    id = Column(Integer, primary_key=True, nullable=False)
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    name = Column(String(32), nullable=False)
    content = Column(String(128))

    def __str__(self):
        return '[{}] "{}" ({}, {})\n{}'.format(self.id, self.name, self.x, self.y, self.content)
    
    def to_dict(self):
        out = {
            "id": self.id,
            "x": self.x,
            "y": self.y,
            "name": self.name,
            "content": self.content
        }
        return out