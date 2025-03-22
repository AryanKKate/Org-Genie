const axios = require('axios');
const FAQ = require('./models/faqModel');

exports.getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({});
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendQueryToPython = async (req, res) => {
  const { query } = req.body;
  try {
    const response = await axios.post("http://localhost:5001/query", { query });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
