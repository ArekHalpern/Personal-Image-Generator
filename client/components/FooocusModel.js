// FooocusModel.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RiseLoader } from 'react-spinners';
import { handleDownload } from './downloadImage';
import { ToastContainer } from 'react-toastify';

const FooocusModel = ({ userInput, negativePrompt }) => {
  const { fooocusResult, isLoading } = useSelector((state) => state.fooocusImage);
  const [imageBlob, setImageBlob] = useState(null);

  useEffect(() => {
    if (fooocusResult && fooocusResult.images && fooocusResult.images[0] && fooocusResult.images[0].url) {
      const imageUrl = fooocusResult.images[0].url;
      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => setImageBlob(URL.createObjectURL(blob)))
        .catch(console.error);
    }
  }, [fooocusResult]);

  return (
    <div>
      <ToastContainer position="top-center" />
      {isLoading ? (
        <div className="loader-container">
          <RiseLoader color="#08bbd3"/>
        </div>
      ) : (
        imageBlob && (
          <div className="text-center">
            <img src={imageBlob} alt="Generated by Fooocus" className="responsive-image" />
            <button className="btn btn-success mt-3" onClick={() => handleDownload(imageBlob, 'fooocus-image.jpeg')}>
              Download Image
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default FooocusModel;
