require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const queryRoutes = require('./queryRoute');
const faqRoutes = require('./routes/faqRoutes');
const erpRoutes = require('./routes/erpRoutes');



const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "faq_db",
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Current routes
app.use('/', queryRoutes);
app.use("/", faqRoutes);
app.use("/erp", erpRoutes);

// API to list available modules
app.get("/list_modules", async (req, res) => {
  try {
    const modules = await DataModel.distinct("module"); // Modify the field as per your DB schema
    res.json({ available_modules: modules });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch modules" });
  }
});

// API to fetch data based on selected module
app.get("/check_module/:module", async (req, res) => {
  try {
    const module = req.params.module;
    const document = await DataModel.findOne({}, { [module]: 1, _id: 0 }); // Fetch only the required module

    if (!document || !document[module]) {
      return res.status(404).json({ error: "Module not found or empty" });
    }

    res.json({ data: document[module] });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get('/dash', async (req, res) => {
  try {
    // Import FAQ model (adjust path as needed)
    const FAQ = require('./models/faqModel');

    const groupedFAQs = await FAQ.aggregate([
      { $sort: { hit: -1 } }, // Sort FAQs by hit descending
      { 
        $group: {
          _id: { $ifNull: [ "$category", "Uncategorized" ] },
          faqs: { $push: "$$ROOT" }
        }
      },
      { $sort: { _id: 1 } } 
    ]);

    res.json(groupedFAQs);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));