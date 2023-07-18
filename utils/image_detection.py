import cv2
import numpy as np
import time
import sys
import os
import json

class ObjectDetection(object):
    """docstring"""

    def __init__(self, image):
        """Constructor"""
        self.image = image
        self.CONFIDENCE = 0.5
        self.SCORE_THRESHOLD = 0.5
        self.IOU_THRESHOLD = 0.5
        self.OUTPUT_PATCH = 'output/'
        self.config_path = "models/yolov3.cfg"
        self.weights_path = "models/yolov3.weights"
        self.LABELS = open("models/coco.names").read().strip().split("\n")
        self.colors = np.random.randint(0, 255, size=(len(self.LABELS), 3), dtype="uint8")
        self.outputImage = ''
        self.outputimg = []
        self.outputImgData = ''
        self.timeTook = ''
        self.font_scale = 2
        self.thickness = 2

    def outputPathname(self):

        # LABELS = open("models/coco.names").read().strip().split("\n")
        # generate colors for each object and subsequent construction
        # colors = np.random.randint(0, 255, size=(len(self.LABELS), 3), dtype="uint8")

        # load the YOLO network
        net = cv2.dnn.readNetFromDarknet(self.config_path, self.weights_path)

        path_name = self.image

        image = cv2.imread(path_name)
        file_name = os.path.basename(path_name)
        filename, ext = file_name.split(".")
        #filename, ext = file_name.split("output")

        h, w = image.shape[:2]
        # create a 4D blob
        blob = cv2.dnn.blobFromImage(image, 1/255.0, (416, 416), swapRB=True, crop=False)

        # sets blob as network input
        net.setInput(blob)
        # get the names of all layers
        ln = net.getLayerNames()
        lnin = net.getUnconnectedOutLayers();
        yolo_layers = [ln[i - 1] for i in net.getUnconnectedOutLayers()]

        #ln = [ln[i[0] - 1] for i in net.getUnconnectedOutLayers()]
        #ln = [ln[i[0] - 1] for i in net.getUnconnectedOutLayers()]

        # feed forward (output) and get network output
        # measurement of time to process in seconds
        start = time.perf_counter()
        layer_outputs = net.forward(yolo_layers)
        # time_took = time.perf_counter() - start
        self.timeTook = time.perf_counter() - start
        #print(f"time {time_took:.2f}s")

        # self.font_scale = 2
        # self.thickness = 1
        boxes, confidences, class_ids = [], [], []
        # loop through each of the outputs of the layer
        for output in layer_outputs:
            # iterate over each object detection
            for detection in output:
                # extract class id (label) and confidence (as probability)
                # detect current object
                scores = detection[5:]
                class_id = np.argmax(scores)
                confidence = scores[class_id]
                # discard weak forecasts by making sure that the ones found
                # probability greater than minimum probability
                if confidence > self.CONFIDENCE:
                    # scale the coordinates of the bounding box relative to
                    # image size considering that YOLO is actually
                    # returns the center coordinates (x, y) of the bounding
                    # field followed by field width and height
                    box = detection[:4] * np.array([w, h, w, h])
                    (centerX, centerY, width, height) = box.astype("int")
                    # use center coordinates (x, y) to get the vertex and
                    # and the left corner of the bounding box
                    x = int(centerX - (width / 2))
                    y = int(centerY - (height / 2))
                    # update our list of bounding box coordinates, validity,
                    # and class IDs
                    boxes.append([x, y, int(width), int(height)])
                    confidences.append(float(confidence))
                    class_ids.append(class_id)

        # iterate over the stored indexes
        idxs = cv2.dnn.NMSBoxes(boxes, confidences, self.SCORE_THRESHOLD, self.IOU_THRESHOLD)

        # IoU (Intersection over Union or intersection over union)

        # make sure at least one object is found
        if len(idxs) > 0:
            # iterate over the stored indexes
            for i in idxs.flatten():
                # extract the coordinates of the bounding box
                x, y = boxes[i][0], boxes[i][1]
                w, h = boxes[i][2], boxes[i][3]
                # draw a bounding box rectangle and label on the image
                color = [int(c) for c in self.colors[class_ids[i]]]
                cv2.rectangle(image, (x, y), (x + w, y + h), color=color, thickness=self.thickness)
                text = f"{ln[class_ids[i]]}: {confidences[i]:.2f}"
                # calculate text width and height to define transparent margins as text background
                (text_width, text_height) = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, fontScale=self.font_scale, thickness=self.thickness)[0]
                text_offset_x = x
                text_offset_y = y - 5
                box_coords = ((text_offset_x, text_offset_y), (text_offset_x + text_width + 2, text_offset_y - text_height))
                overlay = image.copy()
                cv2.rectangle(overlay, box_coords[0], box_coords[1], color=color, thickness=cv2.FILLED)
                # add opacity (field transparency)
                image = cv2.addWeighted(overlay, 0.6, image, 0.4, 0)
                # now put the text (label: trust%)
                cv2.putText(image, text, (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX,
                    fontScale=self.font_scale, color=(0, 0, 0), thickness=self.thickness)
                #cv2.imwrite(filename + "_yolo3." + ext, image)
                cv2.imwrite(os.path.join(self.OUTPUT_PATCH , filename + "_yolo3." + ext), image)

        self.outputImage = os.path.join(self.OUTPUT_PATCH , filename + "_yolo3." + ext)
        self.outputimg = cv2.imread(self.outputImage)
        self.outputImgData = cv2.imencode('.jpg', self.outputimg)[1].tobytes()

        return self.outputImage
