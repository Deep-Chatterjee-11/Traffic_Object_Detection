from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

detection_model = YOLO("yolo-Weights/yolov8n.pt")

@app.route('/upload', methods=['POST'])
def handle_image_upload():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'})

    uploaded_image = request.files['image']
    if uploaded_image.filename == '':
        return jsonify({'error': 'No image selected'})

    try:
        # Read and decode the image
        image_data = uploaded_image.read()
        np_array = np.fromstring(image_data, np.uint8)
        image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
        
        # Perform object detection
        detection_results = detection_model(image)
        
        # Extract detected objects
        detected_objects = [{'class': detection_model.names[int(box.cls[0])],
                             'confidence': f"{int(box.conf[0] * 100)}%"}
                            for result in detection_results for box in result.boxes]
        
        # Count vehicles
        vehicle_count = sum(1 for obj in detected_objects
                            if obj['class'] in ['car', 'truck'])

        return jsonify({'objectsDetected': detected_objects, 'vehicleCount': vehicle_count})

    except Exception as e:
        return jsonify({'error': f'Error processing image: {str(e)}'})


if __name__ == '__main__':
    app.run(debug=True)
