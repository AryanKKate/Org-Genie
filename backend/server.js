require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const queryRoutes = require('./queryRoute');
const faqRoutes = require('./routes/faqRoutes')

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

app.use('/', queryRoutes);
app.use("/", faqRoutes);

app.listen(3001, () => console.log('Server running on port 3001'));
