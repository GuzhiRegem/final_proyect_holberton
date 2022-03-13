#!/usr/bin/python3
"""
    
    module
    return: nothing
"""
from flask import Flask, render_template
app = Flask(__name__)
from flask_cors import CORS
cors = CORS(app, resources={
		r"/*": {"origins": "*"}
	}
)


@app.route('/')
def hello():
    return render_template('index.html')

@app.route('/connect')
def conn():
    return render_template('login.html')

if __name__ == "__main__":
    app.run()
