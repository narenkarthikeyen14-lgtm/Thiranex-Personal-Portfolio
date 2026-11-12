
const express = require("express");
const router = express.Router();

const Contact = require("../models/Contact");

// POST - Save contact form submission
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Create new contact
    const newContact = new Contact({
      name,
      email,
      message,
    });

    // Save to MongoDB
    await newContact.save();

    res.status(201).json({
      success: true,
      message: "Message submitted successfully!",
      data: newContact,
    });

  } catch (error) {
    console.error("Contact API Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
});

module.exports = router;
