const express = require("express");

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

router.get("/getproduct", getProduct);
router.post("/postProduct",postProduct)
router.delete("/deleteProduct/:id",deleteProduct)
router.put("/updateProduct/:id",updateProduct)
module.exports = router;
