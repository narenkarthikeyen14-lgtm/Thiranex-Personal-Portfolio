
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
    dbName: "portfolioDB"
});

        console.log("--------------------------------");
        console.log("MongoDB Connected Successfully!");
        console.log("Database:", mongoose.connection.name);
        console.log("--------------------------------");

    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
