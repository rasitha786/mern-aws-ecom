const express = require("express");
const ProductRoute = require("./routes/productRoute");
const AuthRoute = require("./routes/authRoute");
const dotenv = require("dotenv");
const connectdb = require("./config/db");
dotenv.config();

const app = express();

// Try to connect to database, but don't crash if it fails
connectdb().catch(error => {
    console.log("⚠️  Database connection failed, using in-memory storage");
    // Switch to backup controller
    process.env.USE_MEMORY_DB = 'true';
});
const cors = require("cors");
app.use(cors({
  origin: true, // Your Vite dev server port
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add error handling middleware for JSON parsing
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    console.error('Bad JSON:', error.message);
    return res.status(400).json({ error: 'Invalid JSON format' });
  }
  next();
});

app.use("/api", ProductRoute);
app.use("/api/auth", AuthRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Frontend should connect to: http://localhost:${PORT}`);
  if (process.env.USE_MEMORY_DB) {
    console.log("💾 Using in-memory database (no MongoDB required)");
  }
});
