#!/usr/bin/python3
"""
    movement
    module
    return: nothing
"""
from kivy.uix.widget import Widget
from kivy.core.window import Window
from vectors import Vec2

class Input(Widget):

    def __init__(self, **kwargs):
        super(Input, self).__init__(**kwargs)
        self._keyboard = Window.request_keyboard(
            self._keyboard_closed, self, 'text')
        if self._keyboard.widget:
            pass
        self._keyboard.bind(on_key_down=self._on_keyboard_down)
        self._keyboard.bind(on_key_up=self.on_key_up)
        Window.bind(on_resize=self.on_window_resize)
        self.keys = {"w":0, "s":0, "e":0, "q":0}
        self.offset = Vec2(0,0)
        self.g_pos = Vec2(0,0)
        self.g_zoom = 0.0
        self.__first_pos = Vec2(0,0)
        self.__first_pos1 = Vec2(0, 0)
    
    def on_touch_down(self, touch):
        self.__first_pos = Vec2(touch.pos[0], touch.pos[1])
        self.__first_pos1 = self.g_pos

    def on_touch_move(self, touch):
        print(touch)
        _pos = Vec2(touch.pos[0], touch.pos[1])
        dif = self.__first_pos - _pos
        self.g_pos = self.__first_pos1 - (dif*(1/((self.g_zoom+1)**2)))

    def _keyboard_closed(self):
        self._keyboard.unbind(on_key_down=self._on_keyboard_down)
        self._keyboard = None

    def _on_keyboard_down(self, keyboard, keycode, text, modifiers):
        self.keys[keycode[1]] = 1
        return True

    def on_key_up(self,keyboard, keycode):
        self.keys[keycode[1]] = 0

    def on_window_resize(self, window, width, height):
        self.offset = Vec2(width, height) * 0.5
