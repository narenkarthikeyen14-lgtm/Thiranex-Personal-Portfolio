
const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

router.post("/", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Check required fields
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof message !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid name, email and message."
            });
        }

        // Trim input values
        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanMessage = message.trim();

        // Validate input lengths
        if (
            cleanName.length > 100 ||
            cleanEmail.length > 254 ||
            cleanMessage.length > 2000
        ) {
            return res.status(400).json({
                success: false,
                message: "One or more fields exceed the allowed length."
            });
        }

        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        // Save contact message
        const newContact = new Contact({
            name: cleanName,
            email: cleanEmail,
            message: cleanMessage
        });

        await newContact.save();

        return res.status(201).json({
            success: true,
            message: "Message submitted successfully!"
        });

    } catch (error) {
        console.error("Contact API Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to submit your message. Please try again later."
        });
    }
});

module.exports = router;
