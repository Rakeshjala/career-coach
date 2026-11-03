require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors(process.env.CLIENT_URL ? { origin: process.env.CLIENT_URL } : {}));
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => res.json({ message: "AI Career Coach API is running" }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/coach", require("./routes/coach"));
app.use("/api/history", require("./routes/history"));

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT || 5000, () => console.log("Server running")))
  .catch((e) => { console.error("MongoDB connection failed:", e.message); process.exit(1); });
