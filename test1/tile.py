#!/usr/bin/python3
"""
    Tile
    module
    return: nothing
"""
from vectors import Vec2
from kivy.uix.image import AsyncImage
from kivy.graphics import Rectangle
from kivy.graphics import Color
from kivy.loader import Loader

from kivy.core.window import Window

class Tile(Rectangle):

    offset = Vec2(0,0)

    def __init__(self, root=None, a_pos=Vec2(0,0), a_zoom=0, a_parent=None):
        super().__init__()
        if type(a_pos) == Vec2:
            self.__p_pos = Vec2(a_pos.x, a_pos.y)
        else:
            self.__p_pos = Vec2(a_pos[0], a_pos[1])
        self.__zoom = a_zoom
        self.childs = []
        self.__parent = a_parent
        self.__root = root
        self.__size = Vec2(255,255)
        self.__pos = Vec2(0,0)
        if self.parent is not None:
            Loader.loading_image = self.parent.img_texture
        self.__image = AsyncImage(source='http://a.tile.openstreetmap.fr/hot/{}/{}/{}.png'.format(a_zoom, self.tile_pos.x, self.tile_pos.y))
        self.__root.canvas.clear()
        self.find_root().draw()


    @property
    def img_texture(self):
        return self.__image.texture

    @property
    def p_pos(self):
        return self.__p_pos

    @property
    def zoom(self):
        return self.__zoom

    @property
    def parent(self):
        return self.__parent

    @property
    def tile_pos(self):
        out = self.p_pos.copy()
        if self.parent is not None:
            out += self.parent.tile_pos * 2
        return out

    @property
    def a_pos(self):
        return self.__pos

    @a_pos.setter
    def a_pos(self, value):
        self.__pos = value
        self.pos = (self.__pos.x, self.__pos.y)
    
    @property
    def a_size(self):
        return self.__size

    @a_size.setter
    def a_size(self, value):
        self.__size = value
        self.size = (self.__size.x, self.__size.y)

    def draw(self):
        self.__root.canvas.add(self)
        for a in self.childs:
            a.draw()

    def find_root(self):
        tmp = self
        while tmp.parent is not None:
            tmp = tmp.parent
        return tmp

    def get_center_dist(self):
        w_z = Vec2(Window.size[0], Window.size[1])
        cen_pos = self.a_pos + (self.a_size * 0.5)
        r_pos = cen_pos - (w_z *0.5)
        return r_pos

    def sep(self):
        if len(self.childs) == 0 and self.__zoom < 19:
            for a in range(2):
                for b in range(2):
                    self.childs.append(Tile(self.__root, (a,b), self.__zoom + 1, self))

    def join(self):
        print("join {}c".format(len(self.childs)))
        l = len(self.childs)
        self.__root.canvas.clear()
        for a in range(l):
            del self.childs[0]
        self.find_root().draw()

    def update(self):
        self.texture = self.__image.texture
        if self.parent is not None:
            self.a_size = self.parent.a_size * 0.5
            self.a_pos = self.parent.a_pos + (self.p_pos * self.parent.a_size * 0.25).conj + (0, self.parent.a_size.y * 0.5)
        if self.a_size.x < 230:
            if self.parent is not None:
                self.parent.join()
        d = (self.get_center_dist().module*0.005)**2 + 255
        if self.a_size.x > d and self.get_center_dist().module < 300:
            self.sep()
        amount = 0
        for a in self.childs:
            amount += int(a.get_center_dist().module > 1000 and len(a.childs) == 0)
        if amount == 4:
            self.join()
        for a in self.childs:
            a.update()

    def __str__(self):
        return "size={} pos={} zoom = {}".format(self.a_size, self.a_pos, self.__zoom)

