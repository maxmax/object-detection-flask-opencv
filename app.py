import json
from flask import Flask, request, jsonify, render_template, Response, send_file, make_response
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
from PIL import Image
import numpy as np
import base64
import io
import os

from utils.tf_inference import load_model, inference
######
from utils.image_detection import ObjectDetection
from utils.video_detection import VideoStreaming
from utils.camera_settings import check_settings, reset_settings

os.environ['CUDA_VISIBLE_DEVICES'] = '0'

sess, detection_graph = load_model()

app = Flask(__name__)
CORS(app)
#app.config['CORS_HEADERS'] = 'Content-Type'

#upload_folder = os.path.join('images')
#application.config['UPLOAD'] = upload_folder
upload_folder = os.path.join('images')
root_folder = os.path.join('')
app.config['UPLOAD'] = upload_folder
app.config['ROOT'] = root_folder

#check_settings()
#VIDEO = VideoStreaming()

@app.route("/")
def home():
    return render_template("home.html")

# yolo image for test, be side
@app.route("/image")
def image():
    objectDetection = ObjectDetection('images/a_2.jpg')
    objectDetection.outputPathname()
    return Response(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + objectDetection.outputImgData + b'\r\n\r\n', mimetype='multipart/x-mixed-replace; boundary=frame')

# YOLO
@app.route('/api-yolo-image', methods=['POST'])
def upload():
    if request.method == 'POST':
        files = request.files
        file = files.get('file')
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD'], filename))
        img = os.path.join(app.config['UPLOAD'], filename)

        objectDetection = ObjectDetection(img)
        objectDetection.outputPathname()

        data = {}
        with open(objectDetection.outputImage, mode='rb') as file:
            img = file.read()
        data['image'] = base64.encodebytes(img).decode('utf-8')
        # data['decode'] = base64.b64decode(img)
        # print('json.dumps', json.dumps(data))
        # base64.b64decode(data['img'])

        return jsonify({
            'success': True,
            'file': 'Received',
            'data': [],
            'image': data['image'],
            #'data': objectDetection.outputImgData
        })
    return jsonify({})

# TF
@app.route('/api-tf-image/', methods=["POST"])
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

# http://192.168.1.100:5000/video_feed
@app.route("/video-feed")
def video_feed():
    """
    Video streaming route.
    """
    check_settings()
    VIDEO = VideoStreaming()

    return Response(
        VIDEO.show(),
        mimetype="multipart/x-mixed-replace; boundary=frame"
    )

# http://192.168.1.100:5000/video_feed
@app.route("/api-video-feed")
def api_video_feed():
    """
    Video streaming route.
    """
    check_settings()
    VIDEO = VideoStreaming()

    return jsonify({
        'success': True,
        'file': 'Received',
        'source': 'http://192.168.1.100:5000/video-feed'
    })

@app.route("/api-reset-camera")
def api_reset_camera():
    #check_settings()
    STATUS = reset_settings()
    #VIDEO.preview = not VIDEO.preview
    print('STATUS____', STATUS)
    print("*"*10, STATUS)
    # return "nothing"
    # Response.close()
    return jsonify({
        'success': True,
        'file': 'Received'
    })

#@application.route("/request_preview_switch")
#def request_preview_switch():
#    VIDEO.preview = not VIDEO.preview
#    print("*"*10, VIDEO.preview)
#    return "nothing"

# tf tmp side
@app.route('/tf-image/', methods=["POST"])
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

@app.after_request
def add_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    return response

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
