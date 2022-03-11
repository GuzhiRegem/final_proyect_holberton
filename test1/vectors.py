#!/usr/bin/python3
"""
    Vectors
    module
    return: nothing
"""
import math

class Vec2:
    def __init__(self, x_inp = 0, y_inp = 0):
        self.__x = x_inp
        self.__y = y_inp

    @property
    def x(self):
        return self.__x

    @property
    def y(self):
        return self.__y

    @x.setter
    def x(self, value):
        self.__x = value

    @y.setter
    def y(self, value):
        self.__y = value

    @property
    def module(self):
        return math.sqrt((self.__x * self.__x) + (self.__y * self.__y))

    @property
    def conj(self):
        cpy = self.copy()
        cpy.y *= -1
        return cpy
    
    def __iadd__(self, other):
        if type(other) not in [Vec2, tuple, list]:
            raise TypeError("must be Vec2, tuple(2) or list(2)")
        if type(other) in [tuple, list]:
            self.__x += other[0]
            self.__y += other[1]
            return self
        self.__x += other.x
        self.__y += other.y
        return self
    
    def __add__(self, other):
        cpy = self.copy()
        if type(other) not in [Vec2, tuple, list]:
            raise TypeError("must be Vec2, tuple(2) or list(2)")
        if type(other) in [tuple, list]:
            cpy.x += other[0]
            cpy.y += other[1]
            return cpy
        cpy.x += other.x
        cpy.y += other.y
        return cpy
    
    def __sub__(self, other):
        cpy = self.copy()
        if type(other) not in [Vec2, tuple, list]:
            raise TypeError("must be Vec2, tuple(2) or list(2)")
        if type(other) in [tuple, list]:
            cpy.x -= other[0]
            cpy.y -= other[1]
            return self
        cpy.x -= other.x
        cpy.y -= other.y
        return cpy
    
    def __isub__(self, other):
        if type(other) not in [Vec2, tuple, list]:
            raise TypeError("must be Vec2, tuple(2) or list(2)")
        if type(other) in [tuple, list]:
            self.__x -= other[0]
            self.__y -= other[1]
            return self
        self.__x -= other.x
        self.__y -= other.y
        return self

    def __mul__(self, other):
        cpy = self.copy()
        if type(other) not in [Vec2, tuple, list, int, float]:
            raise TypeError("must be Vec2, tuple(2) or list(2)")
        if type(other) in [int, float]:
            cpy.x *= other
            cpy.y *= other
            return cpy
        lis = [0,0]
        if type(other) in [tuple, list]:
            lis[0] = other[0]
            lis[1] = other[1]
        else:
            lis[0] = other.x
            lis[1] = other.y
        cpy.x = (self.__x * lis[0]) + (self.__x * lis[1])
        cpy.y = (self.__y * lis[0]) + (self.__y * lis[1])
        return cpy
    
    def __imul__(self, other):
        if type(other) not in [Vec2, tuple, list, int, float]:
            raise TypeError("must be Vec2, tuple(2) or list(2)")
        if type(other) in [int, float]:
            self.__x *= other
            self.__y *= other
            return self
        lis = [0,0]
        if type(other) in [tuple, list]:
            lis[0] = other[0]
            lis[1] = other[1]
        else:
            lis[0] = other.x
            lis[1] = other.y
        self.__x = (self.__x * lis[0]) + (self.__x * lis[1])
        self.__y = (self.__y * lis[0]) + (self.__y * lis[1])
        return self

    def copy(self):
        return Vec2(self.x, self.y)

    def __str__(self):
        return "({}, {})".format(self.x, self.y)
