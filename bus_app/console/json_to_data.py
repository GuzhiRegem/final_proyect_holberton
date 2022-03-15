#!/usr/bin/python3
import json
import requests

domain = "http://35.237.138.76:5001"
owner_id = "6226a15abb70784cb6564976"
owner_token = "e914438012994b3c92a32741a4452cce"

parsed = None
with open("test", "r") as f:
    parsed = json.loads(f.read())
route_path = parsed["features"][0]["geometry"]["coordinates"]
route_stops = []
for stop in parsed["features"][1:]:
    route_stops.append(stop["geometry"]["coordinates"])

print("path:", *route_path, sep="\n")
print("stops:", *route_stops, sep="\n")

stops_ids = []
for stop in route_stops:
    r = requests.post(domain + "/api/stops/add",
    headers={"admin_key": "hola"},
    json={"position":stop}
    )
    stops_ids.append(json.loads(r.text)["_id"])
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
