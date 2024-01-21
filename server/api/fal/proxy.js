const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();
const FAL_AI_API_KEY = process.env.FAL_KEY


// Define the URLs as constants
const REMBG_MODEL_URL = 'https://fal.run/fal-ai/imageutils/rembg';
const FOOOCUS_MODEL_URL = 'https://fal.run/fal-ai/fooocus';
const PHOTOMAKER_MODEL_URL = 'https://fal.run/fal-ai/photomaker';

// Helper function to handle API requests
async function handleApiRequest(url, reqBody) {
    
    try {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Key ${FAL_AI_API_KEY}` // Use the declared variable here
            },
            // Increase limits to handle larger payloads
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        };

        const response = await axios.post(url, reqBody, axiosConfig);
        console.log(`Response from ${url}:`, response.data);
        return response;
    } catch (error) {
        console.error(`Error when calling ${url}:`, error);
        throw error;
    }
}

// Fooocus route handler
router.post('/fooocus', async (req, res) => {
    try {
        const response = await handleApiRequest(FOOOCUS_MODEL_URL, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).send(error.response?.data || 'Internal Server Error');
    }
});

// SDXL route handler
router.post('/sdxl', async (req, res) => {
    const SDXL_MODEL_URL = 'https://110602490-fast-sdxl.gateway.alpha.fal.ai';

    try {
        const response = await handleApiRequest(SDXL_MODEL_URL, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).send(error.response?.data || 'Internal Server Error');
    }
});

// Rembg route handler
router.post('/rembg', async (req, res) => {
    try {
        const response = await handleApiRequest(REMBG_MODEL_URL, { image_url: req.body.imageUrl });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).send(error.response?.data || 'Internal Server Error');
    }
});

// Photomaker route handler
router.post('/photomaker', async (req, res) => {
    console.log('Received request to /photomaker with body:', req.body);

    try {
        const response = await handleApiRequest(PHOTOMAKER_MODEL_URL, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error('Error when calling the Photomaker model:', error);

        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
});

module.exports = router;
