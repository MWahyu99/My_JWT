import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

const JWT_SECRET = "da3Aix7uf2ieth8eihuH0iNg5aeheeto";
const TARGET_URL = "https://sihka.dev-tunnels.id/send/kal_iv";

app.post("/proxy", async (req, res) => {
  console.log("📩 Incoming request:", req.body);

  try {
    const { rainfall } = req.body;

    const fullPayload = {
      id_pos: 1,
      uid: "06.14.02030310030",
      name: "PCH Sempaja",
      tzone: "Asia/Jakarta",
      timestamp: new Date().toISOString(),
      sensor: [
        { sensor_name: "Rainfall", value: rainfall }
      ],
    };

    const token = jwt.sign(fullPayload, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "5m",
    });

    const response = await axios.post(
      TARGET_URL,
      { token },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("✅ Token sent to SIHKA:", token.substring(0, 40) + "...");
    console.log("📤 Response from SIHKA:", response.data);

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Proxy running on port ${PORT}`));
