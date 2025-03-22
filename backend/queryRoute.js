const express = require('express');
const { getFAQs, sendQueryToPython } = require('./queryController');
const router = express.Router();

router.get('/faqs', getFAQs);
router.post('/query', sendQueryToPython);

module.exports = router;
