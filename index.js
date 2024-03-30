const express = require('express');
const axios = require('axios');
const url = require('url');

const app = express();

// Define route
app.get('/web', async (req, res) => {
    let websiteUrl = req.query.url; // Assuming the URL is passed as a query parameter

    // Check if the URL parameter is missing
    if (!websiteUrl) {
        return res.status(400).send('Missing parameters: Please provide a URL to check.');
    }

    // Check if the URL has a protocol, if not, prepend "https://"
    if (!url.parse(websiteUrl).protocol) {
        websiteUrl = `https://${websiteUrl}`;
    }

    try {
        const response = await axios.get(websiteUrl);
        res.status(200).sendFile(__dirname + '/200.jpg'); // Sending 200 OK image
    } catch (error) {
        if (error.response) {
            if (error.response.status === 500) {
                res.status(500).sendFile(__dirname + '/500.jpg'); // Sending 500 Internal Server Error image
            } else if (error.response.status === 400) {
                res.status(400).sendFile(__dirname + '/400.jpg'); // Sending 400 Bad Request image
            } else {
                res.status(200).sendFile(__dirname + '/dead.jpg'); // Sending default image for other error statuses
            }
        } else {
            res.status(200).sendFile(__dirname + '/dead.jpg'); // Sending default image for dead website (no response)
        }
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
