require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const queryRoutes = require('./queryRoute');
const faqRoutes = require('./routes/faqRoutes');

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

// New route: /dash
// This route groups FAQs by category (using "Uncategorized" if category is null)
// and sorts FAQs in each group in descending order by the "hit" field.
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
