from flask import Flask, request, jsonify, render_template
from flask_cors import CORS, cross_origin
from PIL import Image
import numpy as np
import base64
import io
import os

from utils.tf_inference import load_model, inference

os.environ['CUDA_VISIBLE_DEVICES'] = '0'

sess, detection_graph = load_model()

app = Flask(__name__)
CORS(app)
#app.config['CORS_HEADERS'] = 'Content-Type'
upload_folder = os.path.join('images')
app.config['UPLOAD'] = upload_folder

@app.route("/")
def home():
    return render_template("tmp-tf.html")

@app.route('/api/', methods=["POST"])
def main_interface():
    response = request.get_json()
    data_str = response['image']
    point = data_str.find(',')
    base64_str = data_str[point:]  # remove unused part like this: "data:image/jpeg;base64,"

    image = base64.b64decode(base64_str)
    img = Image.open(io.BytesIO(image))

    if(img.mode!='RGB'):
        img = img.convert("RGB")

    # convert to numpy array.
    img_arr = np.array(img)

    # do object detection in inference function.
    results = inference(sess, detection_graph, img_arr, conf_thresh=0.5)
    print(results)

    return jsonify(results)

@app.route('/decode/', methods=["POST"])
def dec():
    if request.method == 'POST':
        files = request.files
        file = files.get('file')
        image_string = base64.b64encode(file.read())

        image = base64.b64decode(image_string)
        img = Image.open(io.BytesIO(image))

        if(img.mode!='RGB'):
            img = img.convert("RGB")

        # convert to numpy array.
        img_arr = np.array(img)

        # do object detection in inference function.
        results = inference(sess, detection_graph, img_arr, conf_thresh=0.5)

        return jsonify({
            'success': True,
            'file': 'Received',
            'data': results
        })
    return []

@app.after_request
def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    return response

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
