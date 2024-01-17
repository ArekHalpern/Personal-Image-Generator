import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateImageSdxl } from '../store'; 
import { RiseLoader } from 'react-spinners';
import { handleDownload } from './downloadImage';
import { handleSave } from './saveImage';
import stylePrompts from './stylePrompts';
import StyleNav from './StyleNav';
import { ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSprayCanSparkles } from '@fortawesome/free-solid-svg-icons';

const ImageGenerator = () => {
  const [userInput, setUserInput] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const dispatch = useDispatch();
  const { sdxlResult, isLoading } = useSelector((state) => state.sdxlImage);
  const [imageBlob, setImageBlob] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let fullPrompt = userInput.trim();
    let negativePrompts = ''; // Initialize a variable to hold the negative prompts
  
    if (selectedStyle && stylePrompts[selectedStyle]) {
      const styleDetails = stylePrompts[selectedStyle];
      fullPrompt += ` ${styleDetails.prompt}`; // Add the positive prompt
      negativePrompts = styleDetails.negativePrompt; // Get the negative prompts
    }
  
    console.log('Dispatching SDXL action with prompt:', fullPrompt, 'and negative prompts:', negativePrompts); 
    dispatch(generateImageSdxl(fullPrompt, negativePrompts)); // Pass both prompts to the action
  };

  const handleStyleSelect = (style) => {
    setSelectedStyle((prevStyle) => (prevStyle === style ? '' : style));
  };

  useEffect(() => {
    console.log('SDXL Result:', sdxlResult); 
    if (sdxlResult && sdxlResult.images && sdxlResult.images[0] && sdxlResult.images[0].url) {
      const imageUrl = sdxlResult.images[0].url;
      console.log('Fetching image from URL:', imageUrl);
      fetch(imageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          console.log('Blob received:', blob); 
          const localUrl = URL.createObjectURL(blob);
          console.log('Local URL created:', localUrl); 
          setImageBlob(localUrl);
        })
        .catch((error) => console.error('Error fetching image:', error)); 
    }
  }, [sdxlResult]);
  

  return (
    <div className="image-generator-container">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <form onSubmit={handleSubmit} className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Describe your image here"
          />
          <button className="btn btn-primary" type="submit" disabled={isLoading}>
            <FontAwesomeIcon icon={faSprayCanSparkles} />
          </button>
        </form>
      <StyleNav onSelectStyle={handleStyleSelect} selectedStyle={selectedStyle} />
      <div className="content">
        {isLoading ? (
          <div className="loader-container">
            <RiseLoader color="#08bbd3" />
          </div>
        ) : (
          imageBlob && (
            <div className="img">
              <img src={imageBlob} alt="Generated" />
              <div>
                <button className="btn btn-success mt-3" onClick={() => handleDownload(imageBlob, 'generatedImage.jpeg')}>
                  Download Image
                </button>
                <button className="btn btn-primary mt-3 ml-2" onClick={() => handleSave(imageBlob, dispatch)}>
                  Save Image
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
