#!/usr/bin/python3
import numpy as np

from kivy.app import App
from kivy.clock import Clock
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.widget import Widget
from kivy.core.window import Window
from kivy.uix.image import AsyncImage

from kivy.graphics import Rectangle
from kivy.graphics import Color
from kivy.loader import Loader

from tile import Tile
from vectors import Vec2

root = FloatLayout()
Window.size = (500,500)
off = np.array(Window.size)
off = off * 0.5
pos = np.array([0,0])
zoom = 0.0
keys = {"w":0, "s":0, "e":0, "q":0}
til_size = np.array([256, 256])
map_root = Tile(root)

map_zoom = 0
pressed_e = 0
pressed_q = 0
def update(dt):
    global pos, zoom, keys, root, pressed_e, pressed_q, map_root, off
    zoom *= (keys["w"] * 0.01) - (keys["s"] * 0.01) + 1
    if zoom < 1.0:
        zoom = 1.0
    r_zoom = (zoom)**2

    with root.canvas:
        map_root.a_size = Vec2(255, 255) * r_zoom
        tmp = Vec2(pos[0], pos[1]) * (r_zoom + 1)
        Tile.offset = Vec2(off[0], off[1]) + tmp
        map_root.a_pos = Vec2(0,0) - (map_root.a_size * 0.5) + Tile.offset
        map_root.update()

first_pos = np.array([0,0])
first_pos1 = np.array([0,0])
class Input_a(Widget):
    global keys

    def on_touch_down(self, touch):
        global first_pos, pos, first_pos1
        first_pos = np.array(list(touch.pos))
        first_pos1 = pos

    def on_touch_move(self, touch):
        global fisrt_pos, pos, first_pos1,zoom
        _pos = np.array(list(touch.pos))
        dif = first_pos - _pos
        pos = first_pos1 - (dif/((zoom)**2))

    def __init__(self, **kwargs):
        super(Input_a, self).__init__(**kwargs)
        self._keyboard = Window.request_keyboard(
            self._keyboard_closed, self, 'text')
        if self._keyboard.widget:
            pass
        self._keyboard.bind(on_key_down=self._on_keyboard_down)
        self._keyboard.bind(on_key_up=self.on_key_up)
        Window.bind(on_resize=self.on_window_resize)

    def _keyboard_closed(self):
        print('My keyboard have been closed!')
        self._keyboard.unbind(on_key_down=self._on_keyboard_down)
        self._keyboard = None

    def _on_keyboard_down(self, keyboard, keycode, text, modifiers):
        keys[keycode[1]] = 1
        return True

    def on_key_up(self,keyboard, keycode):
        keys[keycode[1]] = 0

    def on_window_resize(self, window, width, height):
        global off
        off = np.array([width, height]) / 2


class MyApp(App):
    def build(self):
        global root, off, objs, map_root
        Clock.schedule_interval(update, 1.0/60)
        root.add_widget(Input_a())
        return root


if __name__ == '__main__':
    MyApp().run()
