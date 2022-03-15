#!/usr/bin/python3
import cmd
import requests
import json
from pygments import highlight
from pygments.formatters.terminal256 import Terminal256Formatter
from pygments.lexers.web import JsonLexer
import re
from getpass import getpass

def prettyJson(inp):
    dic = json.loads(inp)
    formatted_json = json.dumps(dic, sort_keys=True, indent=4)
    out = highlight(
        formatted_json,
        lexer=JsonLexer(),
        formatter=Terminal256Formatter(),
    )
    print()
    print(out)

domain = "http://35.237.138.76:5001"
class Shell(cmd.Cmd):
    read_token = ""
    write_token = ""
    user = ""
    user_id = ""
    prompt = '(no-user) '

    def do_sign_up(self, arg):
        trys = 2
        print("\nvalid username:\n-only contains alphanumeric characters or ._@")
        while (1):
            i_user = input("\n   username: ")
            if re.fullmatch(r'[a-zA-Z0-9._@]+', i_user):
                break
            trys -= 1
            print("invalid username")
            if trys == 0:
                print("error")
                return False
        i_name = input("\n   name(how you want to be seen): ")
        trys = 2
        while (1):
            i_email = input("\n   email: ")
            if re.fullmatch(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', i_email):
                break
            trys -= 1
            print("invalid email")
            if trys == 0:
                print("error")
                return False
        trys = 2
        print("\nvalid password:\n-8 characters min\n-contains an uppercase letter\n-contains a lowercase letter\n-contains a number\n-contains a special character: !@#$%()-_+.,")
        while (1):
            i_pass = getpass(prompt='\n   password: ')
            if re.fullmatch(r'(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\!\@\#\$\%\(\)\-\_\+\.\,]).{8,}', i_pass):
                break
            trys -= 1
            print("invalid password")
            if trys == 0:
                print("error")
                return False
        i_confirm = getpass(prompt='\n   confirm password: ')
        if (i_pass != i_confirm):
            print("different passwords")
            return False
        response = requests.post(domain + "/api/users/add", json={
            "username": i_user,
            "password": i_pass,
            "name": i_name,
            "email": i_email
        })
        print(response.text)

    def do_login(self, arg):
        i_user = input("username: ")
        i_pass = getpass(prompt="password: ")
        response = requests.post(domain + "/api/get_tokens", json={
            "username": i_user,
            "password": i_pass
        })
        if response.status_code != 200:
            print(response.text)
            return False
        r_j = json.loads(response.text)
        self.read_token = r_j["read_token"]
        self.write_token = r_j["write_token"]
        self.user = i_user
        self.prompt = "({}) ".format(self.user)
        response = requests.get(domain + "/api/users/"+ self.user, headers={"token": self.read_token})
        self.user_id=json.loads(response.text)["_id"]

    def do_me(self, arg):
        if self.user == "":
            print("login or sign up first")
            return False
        response = requests.get(domain + "/api/users/"+ self.user, headers={"token": self.read_token})
        prettyJson(response.text);
    
    def do_my(self, arg):
        if self.user == "":
            print("login or sign up first")
            return False
        args = arg.split()
        if len(args) < 1:
            print("syntax: my buses/points/routes")
            return False
        if args[0] not in ["buses", "points", "routes"]:
            print("syntax: my buses/points/routes")
            return False
        response = requests.get(domain + "/api/users/"+ self.user + "/" + args[0], headers={"token": self.read_token})
        prettyJson(response.text);

    def do_edit(self, arg):
        if self.user == "":
            print("login or sign up first")
            return False
        args = arg.split(" ", 3)
        if len(args) < 4:
            print("syntax: edit buses/points/routes <id> key value")
            return False
        if args[0] not in ["buses", "points", "routes"]:
            print("invalid object: " + args[0])
            return False
        args[3] = json.loads(args[3])
        response = requests.put(
            domain + "/api/" + args[0] + "/edit/" + args[1],
            headers={"token": self.write_token},
            json={args[2]: args[3]}
        )
        print(response.text)

    def do_delete(self, arg):
        if self.user == "":
            print("login or sign up first")
            return False
        args = arg.split()
        if len(args) < 2:
            print("syntax: delete buses/points/routes <id>")
            return False
        if args[0] not in ["buses", "points", "routes"]:
            print("invalid object: " + args[0])
            return False
        response = response = requests.delete(
            domain + "/api/" + args[0] + "/delete/" + args[1],
            headers={"token": self.write_token}
        )
        print(response.text)

    def do_add(self, arg):
        if self.user == "":
            print("login or sign up first")
            return False
        args = arg.split(" ", 1)
        if len(args) < 2:
            print("syntax: add buses/points/routes <json>")
            return False
        if args[0] not in ["buses", "points", "routes"]:
            print("invalid object: " + args[0])
            return False
        try:
            obj = json.loads(args[1])
        except:
            print("invalid json")
            return False
        obj["owner"] = self.user_id
        response = requests.post(
            domain + "/api/" + args[0] + "/add/",
            json=obj,
            headers={"token": self.write_token}
        )
        if response.status_code == 200:
            prettyJson(response.text)
        else:
            print(response.text)

    def do_get(self, arg):
        if self.user == "":
            print("login or sign up first")
            return False
        args = arg.split()
        if len(args) < 2:
            print("syntax: get buses/points/routes <id>")
            return False
        if args[0] not in ["buses", "points", "routes"]:
            print("invalid object: " + args[0])
            return False
        response = requests.get(
            domain + "/api/" + args[0] + "/get/" + args[1],
            headers={"token": self.read_token}
        )
        if response.status_code == 200:
            prettyJson(response.text)
        else:
            print(response.text)

    def do_users(self, arg):
        response = requests.get(domain + "/api/users/")
        prettyJson(response.text);
    
    def do_buses(self, arg):
        response = requests.get(domain + "/api/buses/")
        prettyJson(response.text);
    
    def do_routes(self, arg):
        response = requests.get(domain + "/api/routes/")
        prettyJson(response.text);
    
    def do_stops(self, arg):
        response = requests.get(domain + "/api/stops/")
        prettyJson(response.text);
    
    def do_points(self, arg):
        response = requests.get(domain + "/api/points/")
        prettyJson(response.text);

    def do_EOF(self, arg):
        print()
        return True

    def do_tokens(self, arg):
        print("write: {}".format(self.write_token))
        print("read: {}".format(self.read_token))

if __name__ == '__main__':
    Shell().cmdloop()
