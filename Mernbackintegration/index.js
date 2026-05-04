const express = require("express");
const ProductRoute = require("./routes/productRoute");
const AuthRoute = require("./routes/authRoute");
const OrderRoute = require("./routes/orderRoute"); // ✅ NEW
const dotenv = require("dotenv");
const connectdb = require("./config/db");
dotenv.config();

const app = express();

connectdb().catch(error => {
  console.log("⚠️  Database connection failed, using in-memory storage");
  process.env.USE_MEMORY_DB = 'true';
});

const cors = require("cors");
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ error: 'Invalid JSON format' });
  }
  next();
});

app.use("/api", ProductRoute);
app.use("/api/auth", AuthRoute);
app.use("/api", OrderRoute); // ✅ NEW — order routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});