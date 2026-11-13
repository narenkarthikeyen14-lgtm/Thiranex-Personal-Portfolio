
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Contact form rate limiter
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many messages submitted. Please try again later."
    }
});

// Contact Form API
app.use("/api/contact", contactLimiter, contactRoutes);

// Frontend static files
const publicPath = path.resolve(__dirname, "..", "public");

console.log("Public folder:", publicPath);

app.use(express.static(publicPath));

// Health Check API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Portfolio backend is running!",
        database: "Connected",
        timestamp: new Date().toISOString()
    });
});

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

// Start server after database connection
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
