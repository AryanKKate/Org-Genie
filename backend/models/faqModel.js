const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    hits: { type: Number, default: 0 },
    category: { type: String, enum: ["Sales", "HR", "Finance"], required: true },
  },
  { collection: "Faq" ,versionKey: false } // Ensures MongoDB uses 'Faq' as the collection name
);

// Create the model before exporting
const Faq = mongoose.model("Faq", faqSchema,"Faq");

module.exports = Faq; // Now Faq is correctly defined before exporting
