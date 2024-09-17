import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.post("/authenticate", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const r = await axios.put(
      "https://api.chatengine.io/users/",
      { username, secret: username, first_name: username },
      { headers: { "private-key": "d6266761-f2d8-48d3-a4b1-ff09d1d38862" } }
    );
    return res.status(r.status).json(r.data);
  } catch (e) {
    if (e.response) {
      return res.status(e.response.status).json(e.response.data);
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
});

app.listen(3001);
