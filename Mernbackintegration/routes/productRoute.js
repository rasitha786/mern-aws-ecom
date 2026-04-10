const express = require("express");
const { authenticate, adminOnly } = require("../middleware/auth");

// Use backup controller if MongoDB is not available
let controller;
if (process.env.USE_MEMORY_DB === 'true') {
    controller = require("../controller/productController-backup");
    console.log("💾 Using in-memory database controller");
} else {
    controller = require("../controller/productController");
}

const { getProduct, postProduct, deleteProduct, updateProduct } = controller;
const router = express.Router();

// Public routes
router.get("/getproduct", getProduct);

// Protected routes (require authentication)
router.post("/postProduct", authenticate, postProduct);
router.delete("/deleteProduct/:id", authenticate, adminOnly, deleteProduct);
router.put("/updateProduct/:id", authenticate, adminOnly, updateProduct);

module.exports = router;
