const express = require("express");
const Faq = require("../models/faqModel");

const router = express.Router();

// AI-based Category Classification (Mock)
const classifyCategory = (question) => {
  const lowerCaseQuestion = question.toLowerCase();
  if (lowerCaseQuestion.includes("salary") || lowerCaseQuestion.includes("hiring")) {
    return "HR";
  } else if (lowerCaseQuestion.includes("invoice") || lowerCaseQuestion.includes("tax")) {
    return "Finance";
  } else {
    return "Sales";
  }
};

// Add FAQ
router.post("/add-faq", async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: "Question and answer are required" });
    }

    const category = classifyCategory(question);

    const newFaq = new Faq({ question, answer, category });

    console.log("📌 Saving to MongoDB:", newFaq); // Debugging log

    await newFaq.save();

    console.log("✅ FAQ saved successfully!");
    res.status(201).json({ message: "FAQ added successfully", data: newFaq });
  } catch (error) {
    console.error("❌ Error Saving FAQ:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get FAQs
router.get("/faqs", async (req, res) => {
  try {
    const faqs = await Faq.find();
    console.log("📌 Fetching FAQs:", faqs); // Debugging log
    res.json(faqs);
  } catch (error) {
    console.error("❌ Error Fetching FAQs:", error);
    res.status(500).json({ error: "Error fetching FAQs" });
  }
});

module.exports = router;
