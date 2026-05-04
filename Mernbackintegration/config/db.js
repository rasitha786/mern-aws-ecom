const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectdb = async () => {
    try {
        const atlasDB = process.env.MONGO_URI;  // ✅ Fixed here
        
        console.log("Connecting to MongoDB Atlas...");
        
        await mongoose.connect(atlasDB, {
            serverSelectionTimeoutMS: 10000
        });
        console.log("✅ Connected to MongoDB Atlas");
        
    } catch (error) {
        console.error("❌ Database Connection Failed:", error.message);
        console.log("💡 Check your Atlas connection string and IP whitelist");
        throw error;
    }
};

module.exports = connectdb;