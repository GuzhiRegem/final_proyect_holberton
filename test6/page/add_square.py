#!/usr/bin/python3
import json
import requests

domain = "http://35.237.138.76:5001"
owner_id = "6226a15abb70784cb6564976"
owner_token = "e914438012994b3c92a32741a4452cce"

x = -56.2554931640625
y = -34.71000915922493
while y > -34.917466889282515:
    while x < -56.07421875:
        r = requests.post(
            domain + "/api/points/add",
            headers={"token": owner_token},
            json={
                "owner": owner_id,
                "content": "test :)",
                "position": [x, y]
            }
        )
        print(r)
        x += 0.001
    y -= 0.001
"""
r = requests.post(
    domain + "/api/routes/add",
    headers={"token": owner_token},
    json={
        "owner": owner_id,
        "name": "test",
        "points": route_path,
        "stops": stops_ids
    }
)
print(json.dumps(json.loads(r.text)))
"""
