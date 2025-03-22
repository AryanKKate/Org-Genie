require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const queryRoutes = require('./queryRoute');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.use('/', queryRoutes);

app.listen(3001, () => console.log('Server running on port 3001'));
