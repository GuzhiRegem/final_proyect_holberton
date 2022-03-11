#!/usr/bin/python3
import json
import requests

domain = "http://35.237.138.76:5001"
r = requests.get(domain + "/api/stops")
js = json.loads(r.text)
out = []
for obj in js:
    out.append(obj["_id"])
print(out)
