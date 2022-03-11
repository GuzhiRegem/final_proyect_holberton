#!/user/bin/python3
"""Start"""
from crypt import methods
from flask import Flask, request, jsonify
from test3.engine import Storage
import json
app = Flask(__name__)
storage = Storage()

@app.route('/radio/<int:x>/<int:y>/<int:r>', strict_slashes=False)
def pointradius(x, y, r):
    """ADD points"""
    lista = storage.get_radius(r, x, y)
    dic = {"content" : []}
    for tmp in lista:
        dic["content"].append(tmp.to_dict())
    return json.dumps(dic)


@app.route('/addpoint', methods=['POST'])
def addpoint():
    """add point"""
    if (request.headers.get('Content-Type') != 'application/json'):
        return (jsonify("Not a JSON"), 400)
    data = json.loads(request.data)
    lis = data.keys()
    sub_list = ["x", "y", "name", "content"]
    if not (all(x in lis for x in sub_list)):
        return (jsonify("Missing keys"), 400)
    dic = storage.add_point(data["x"], data["y"], data["name"], data["content"])
    return json.dumps(dic.to_dict())


@app.route('/delete/<int:x>/<int:y>', methods=['DELETE'])
def delete(x, y):
    """Delete point"""
    storage.delete_point(x, y)
    storage.save()
    return (jsonify({}))


@app.route('/drop', methods=['POST'])
def dropout():
    """drop all points"""
    storage.drop()
    storage.save()
    return (jsonify({}))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000')
