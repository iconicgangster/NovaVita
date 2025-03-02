const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Load environment variables from .env file
require('dotenv').config();

app.use(express.static('public'));
app.use(express.json());

app.post('/api/classify', async (req, res) => {
    const { image } = req.body;
    try {
        const response = await axios.post('YOUR_API_ENDPOINT', {
            image: image,
            apiKey: process.env.API_KEY
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error classifying image' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
