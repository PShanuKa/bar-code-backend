import express from "express";
import axios from "axios";
const app = express();
const port = 3000;
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  console.error("Missing required environment variables: CLIENT_ID or CLIENT_SECRET");
  process.exit(1); 
}

app.get("/", (req, res) => {
  res.send("App is runningg");
});

app.get("/token", async (req, res) => {
  try {
    const response = await axios.post(
      "https://login.microsoftonline.com/fa51c2d9-b92c-4ee0-8186-a8733f338c47/oauth2/v2.0/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
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
      res.json({ success: true, access_token: data.access_token });
    } else {
      res
        .status(400)
        .json({ success: false, message: "No access token received" });
    }
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to refresh token" });
  }
});

app.get("/token2", async (req, res) => {
  try {
    const response = await axios.post(
      "https://login.microsoftonline.com/c6cf37b6-3276-427f-b234-138b91881f10/oauth2/v2.0/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_ID2,
        client_secret: process.env.CLIENT_SECRET2,
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
      res.json({ success: true, access_token: data.access_token });
    } else {
      res
        .status(400)
        .json({ success: false, message: "No access token received" });
    }
  } catch (error) {
    console.error("Error refreshing token:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to refresh token" });
  }
});

app.get("/subscription/:token", async (req, res) => {
  const token = req.params.token;
  if (
    token ===
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  ) {

    const data = {
      subscriptionId: "1234567890",
      availableDate: 15,
      access : true

    }
    res.json({ success: true, message: "Subscription data", data });
  } else {
    const data = {
      access: false,
    };
    res.json({ success: false, message: "Invalid token", data });
  }
});


app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
