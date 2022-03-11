#!/usr/bin/python3
"""Start link class to table in database 
"""
from re import A
import re
from sys import argv
from click import prompt
from sqlalchemy import false
from test3.engine import Storage
import cmd
import signal
import plotly.express as px
from shlex import split

storage = None

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'



class Console(cmd.Cmd):
    prompt = '\033[1m\033[4m\033[92mPoints ->\033[0m '
    def __init__(self):
        super().__init__()
        signal.signal(signal.SIGINT, self.exit)

    def exit(self, *args):
        print("\n"+Console.prompt, end="")
        return True

    def preloop(self):
        print(bcolors.HEADER+bcolors.BOLD+"\n..:: Points Console ::.."+bcolors.ENDC)
        print(bcolors.WARNING+"Type help or ? to list commands.\n"+bcolors.ENDC)
    
    def postloop(self):
        print(bcolors.HEADER+bcolors.BOLD+"\n··::Closing::··\n"+bcolors.ENDC)
    
    def do_EOF(self, arg):
        """
        exits the console
        """
        print()
        return True

    def do_add(self, arg):
        """
        \033[96madds a new point to the database
        \033[92msyntax: add <x: float> <y: float> <name: str> <content: str = None>\033[0m
        """
        args = split(arg)
        try:
            num1 = float(args[0])
        except:
            print("syntax: add " + bcolors.BOLD + bcolors.FAIL + "<x: float> <y: float> <name: str>" + bcolors.ENDC + " <content: str = None>")
            return False
        try:
            num2 = float(args[1])
        except:
            print("syntax: add <x: float> " + bcolors.BOLD + bcolors.FAIL + "<y: float> <name: str>" + bcolors.ENDC + " <content: str = None>")
            return False
        try:
            name = float(args[2])
        except:
            print("syntax: add <x: float> " + bcolors.BOLD + bcolors.FAIL + "<y: float> <name: str>" + bcolors.ENDC + " <content: str = None>")
            return False
        content = None
        if (len(args) > 3):
            content = args[3]
        point = storage.add_point(num1, num2, name, content)
        print(point)
        storage.save()
    
    def do_rm(self, arg):
        """
        \033[96mremoves a point on the database
        \033[92msyntax: rm <x: float> <y: float>\033[0m
        """
        args = split(arg)
        try:
            num1 = float(args[0])
        except:
            print("syntax: rm " + bcolors.BOLD + bcolors.FAIL + "<x: float> <y: float>" + bcolors.ENDC)
            return False
        try:
            num2 = float(args[1])
        except:
            print("syntax: rm <x: float> " + bcolors.BOLD + bcolors.FAIL + "<y: float>" + bcolors.ENDC)
            return False
        storage.delete_point(num1, num2)
        storage.save()
    
    def do_radius(self, arg):
        """
        \033[96mshow all points on a radius
        \033[92msyntax: radius <x: float> <y: float> <radius: float>\033[0m
        """
        args = split(arg)
        try:
            num1 = float(args[0])
        except:
            print("syntax: radius " + bcolors.BOLD + bcolors.FAIL + "<x: float> <y: float> <radius: float>" + bcolors.ENDC)
            return False
        try:
            num2 = float(args[1])
        except:
            print("syntax: radius <x: float> " + bcolors.BOLD + bcolors.FAIL + "<y: float> <radius: float>" + bcolors.ENDC)
            return False
        try:
            num3 = float(args[2])
        except:
            print("syntax: radius <x: float> <y: float> " + bcolors.BOLD + bcolors.FAIL + "<radius: float>" + bcolors.ENDC)
            return False
        points = storage.get_radius(num3, num1, num2)
        for point in points:
            print(point)
    
    def do_removeall(self, arg):
        """
        \033[96mremoves a point on the database
        \033[92msyntax: rm <x: float> <y: float>\033[0m
        """
        storage.drop()
    
    def do_all(self, arg):
        """
        prints all points
        """
        points = storage.all()
        for point in points:
            print(point)
    
    def do_exit(self, *arg):
        """
        exits the console
        """
        return True
    
    def do_addsquare(self, arg):
        """
        \033[96madds a square of points to the database
        \033[92msyntax: add <x1: float> <y1: float> <x2: float> <y2: float> <name: str> <content: str = None>\033[0m
        """
        args = split(arg)
        try:
            num1 = int(args[0])
        except:
            print("syntax: add " + bcolors.BOLD + bcolors.FAIL + "<x1: float> <y1: float> <x2: float> <y2: float> <name: str>" + bcolors.WARNING + " <content: str = None>" + bcolors.ENDC)
            return False
        try:
            num2 = int(args[1])
        except:
            print("syntax: add <x1: float> " + bcolors.BOLD + bcolors.FAIL + "<y1: float> <x2: float> <y2: float> <name: str>" + bcolors.WARNING + " <content: str = None>" + bcolors.ENDC)
            return False
        try:
            num3 = int(args[2])
        except:
            print("syntax: add <x1: float> <y1: float> " + bcolors.BOLD + bcolors.FAIL + "<x2: float> <y2: float> <name: str>" + bcolors.WARNING + " <content: str = None>" + bcolors.ENDC)
            return False
        try:
            num4 = int(args[3])
        except:
            print("syntax: add <x1: float> <y1: float> <x2: float> " + bcolors.BOLD + bcolors.FAIL + "<y2: float> <name: str>" + bcolors.WARNING + " <content: str = None>" + bcolors.ENDC)
            return False
        try:
            name = args[4]
        except:
            print("syntax: add <x1: float> <y1: float> <x2: float> <y2: float> " + bcolors.BOLD + bcolors.FAIL + "<name: str>" + bcolors.ENDC + " <content: str = None>")
            return False
        content = None
        if (len(args) > 4):
            content = args[5]
        print("adding square")
        for x in range(num1, num3):
            for y in range(num2, num4):
                point = storage.add_point(x, y, name, content)
                print(point)
        storage.save()

    
    def do_draw(self, arg):
        args = split(arg)
        if len(args) < 1:
            points = storage.all()
        else:
            if args[0] != "radius":
                return False
            try:
                num1 = float(args[1])
            except:
                print("syntax: draw radius " + bcolors.BOLD + bcolors.FAIL + "<x: float> <y: float> <radius: float>" + bcolors.ENDC)
                return False
            try:
                num2 = float(args[2])
            except:
                print("syntax: draw radius <x: float> " + bcolors.BOLD + bcolors.FAIL + "<y: float> <radius: float>" + bcolors.ENDC)
                return False
            try:
                num3 = float(args[3])
            except:
                print("syntax: draw radius <x: float> <y: float> " + bcolors.BOLD + bcolors.FAIL + "<radius: float>" + bcolors.ENDC)
                return False
            points = storage.get_radius(num3, num1, num2)
        x = []
        y = []
        for point in points:
            x.append(point.x)
            y.append(point.y)
        if len(x) < 1:
            return False
        fig = px.scatter(x=x, y=y)
        fig.update_traces(marker={'size': 15})
        fig.show()

if __name__ == "__main__":
    storage = Storage()
    Console().cmdloop()
    storage.close()
