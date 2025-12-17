const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectdb = async () => {
    try {
        // Connect directly to Atlas
        const atlasDB = process.env.MONGO_URL;
        
        console.log("Connecting to MongoDB Atlas...");
        
        await mongoose.connect(atlasDB, {
            serverSelectionTimeoutMS: 10000
        });
        console.log("✅ Connected to MongoDB Atlas");
        
    } catch (error) {
        console.error("❌ Database Connection Failed:", error.message);
        console.log("💡 Check your Atlas connection string and IP whitelist");
        process.exit(1);   
    }
};

module.exports = connectdb;
