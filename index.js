const express = require('express');
const axios = require('axios'); // Use axios for HTTP requests
const app = express();
const port = 3000;

// Middleware to parse JSON (if needed)
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('App is running');
});

// Token refresh endpoint
app.get('/token', async (req, res) => {
  try {
    const response = await axios.post(
      "https://login.microsoftonline.com/fa51c2d9-b92c-4ee0-8186-a8733f338c47/oauth2/v2.0/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: "7e53abf2-255e-4ff6-a68d-d674c6571d3a",
        client_secret: "xno8Q~l~kYNh7cVGsFniCBOryvEmAIdhfcHMlcgh",
        scope: "https://api.businesscentral.dynamics.com/.default",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = response.data;

    if (data.access_token) {
      // Optionally store the token in memory or a database
      // For simplicity, we'll just return it here
      res.json({ success: true, access_token: data.access_token });
    } else {
      res.status(400).json({ success: false, message: "No access token received" });
    }
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    res.status(500).json({ success: false, message: "Failed to refresh token" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});