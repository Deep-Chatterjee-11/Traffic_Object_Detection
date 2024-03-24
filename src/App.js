import React, { useState } from 'react';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [objectsDetected, setObjectsDetected] = useState([]);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // New state for handling errors

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleImageUpload = () => {
    if (!image) {
      setError('Please select an image.');
      return;
    }

    setIsLoading(true);
    setError(null); // Clear previous errors

    const formData = new FormData();
    formData.append('image', image);

    fetch('http://127.0.0.1:5000/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        const detectedObjects = data.objectsDetected || [];
        const count = data.vehicleCount || 0;
        setObjectsDetected(detectedObjects);
        setVehicleCount(count);
      })
      .catch(error => {
        console.error('Error uploading image:', error);
        setError('Error uploading image. Please try again.'); // Set error message for user
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Transportation Image Object Detection</h1>
      </header>

      <div className="content">

        <div class="format">
        <div className="upload-form">
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <button className="button" onClick={handleImageUpload} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Upload'}
          </button>
          {error && <p className="error-message">{error}</p>} {/* Display error message */}
        </div>
        <div className="image-display">
          <h2>Image Uploaded: </h2>
          {image && (
            <img className="image" src={URL.createObjectURL(image)} alt="Original-Image" />
          )}
        </div>
        </div>

        <h2>Number of Vehicles: {vehicleCount}</h2>
        <div className="detection-results">
          {objectsDetected.length > 0 ? (
            <ul>
              {objectsDetected.map((obj, index) => (
                <div key={index} className="object-card">
                  <div className="object-info">
                    <h3>{obj.class}</h3>
                    <p>Accuracy: {obj.confidence}</p>
                  </div>
                </div>
              ))}
            </ul>
          ) : (
            <p>No objects detected.</p>
          )}
        </div>
      </div>
      
      <footer className="footer">
        <p>By: Deep Jyoti Chatterjee</p>
      </footer>
    </div>
  );
}

export default App;