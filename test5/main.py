#!/usr/bin/python3
"""Start link class to table in database 
"""
import cmd
from engine.storage import Storage

class Console(cmd.Cmd):
    def do_hello(self, args):
        print(args)
if __name__ == "__main__":
    storage = Storage()
    Console().cmdloop()
    storage.close()
