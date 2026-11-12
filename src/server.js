
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Contact Form API Routes
app.use("/api/contact", contactRoutes);

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
