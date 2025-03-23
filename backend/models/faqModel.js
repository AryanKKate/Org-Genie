const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    hit: { type: Number, default: 0 },
    category: { type: String, enum: ["Sales", "HR", "Finance"], required: true },
  },
  { collection: "Faq" ,versionKey: false }
);


const Faq = mongoose.model("Faq", faqSchema,"Faq");

module.exports = Faq; 
