import cv2
import os
from flask import Flask, render_template, request, Response, redirect, url_for, jsonify, send_from_directory, send_file
from flask_cors import CORS
from flask_bootstrap import Bootstrap
from werkzeug.utils import secure_filename

from utils.image_detection import ObjectDetection
from utils.video_detection import VideoStreaming
from utils.camera_settings import check_settings, reset_settings

application = Flask(__name__)
CORS(application)
Bootstrap(application)

upload_folder = os.path.join('images')
application.config['UPLOAD'] = upload_folder


@application.route("/")
def home():
    return render_template("home.html")

@application.route("/image")
def image():
    objectDetection = ObjectDetection('images/a_2.jpg')
    objectDetection.outputPathname()
    return Response(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + objectDetection.outputImgData + b'\r\n\r\n', mimetype='multipart/x-mixed-replace; boundary=frame')

@application.route("/decode")
def decode():
    return render_template("image.html", user_image="/image")


@application.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        file = request.files['img']
        filename = secure_filename(file.filename)
        file.save(os.path.join(application.config['UPLOAD'], filename))
        img = os.path.join(application.config['UPLOAD'], filename)

        objectDetection = ObjectDetection(img)
        objectDetection.outputPathname()

        #image = get_image(objectDetection.outputImgData)

        return Response(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + objectDetection.outputImgData + b'\r\n\r\n', mimetype='multipart/x-mixed-replace; boundary=frame')
        #return render_template('upload.html', img=image)
    return render_template('upload.html')

@application.route("/video")
def video():
    TITLE = "Object detection"
    return render_template("index.html", TITLE=TITLE)

@application.route("/video_feed")
def video_feed():
    """
    Video streaming route.
    """
    # Video Streaming
    check_settings()
    VIDEO = VideoStreaming()

    return Response(
        VIDEO.show(),
        mimetype="multipart/x-mixed-replace; boundary=frame"
    )

if __name__ == "__main__":
    application.run(debug=True)
