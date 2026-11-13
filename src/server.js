const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(helmet());

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Middleware


// Contact Form API Routes
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many messages submitted. Please try again later."
    }
});

app.use("/api/contact", contactLimiter, contactRoutes);

// Serve frontend files
app.use(express.static(path.join(__dirname, "../public")));

// Health check API
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
    res.sendFile(
        path.join(__dirname, "../public/index.html")
    );
});

// Start server after database connection
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
