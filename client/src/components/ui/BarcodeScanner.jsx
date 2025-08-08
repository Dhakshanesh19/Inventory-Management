import React, { useRef, useEffect, useState } from 'react';
import Modal from '../common/Modal';

const BarcodeScanner = ({ show, onClose, onScan }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Access the user's webcam
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch(err => {
          console.error("Error accessing the webcam:", err);
          setError("Could not access the camera. Please check your permissions.");
        });
    }

    // Clean up the video stream when the modal is closed
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [show]);

  const handleScanClick = () => {
    // This is a placeholder for the actual scanning logic.
    // In a real application, you would integrate a library like
    // QuaggaJS or a similar barcode scanner library here.
    console.log("Simulating a barcode scan...");
    const mockBarcode = "1234567890";
    onScan(mockBarcode);
    onClose();
  };

  return (
    <Modal show={show} title="Barcode Scanner" onClose={onClose}>
      <div className="scanner-container">
        {error ? (
          <div className="scanner-error-message">{error}</div>
        ) : (
          <>
            <video ref={videoRef} className="scanner-video" />
            <div className="scanner-overlay">
              <div className="scanner-frame"></div>
            </div>
            <button className="btn btn-primary" onClick={handleScanClick}>Scan Barcode</button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default BarcodeScanner;
