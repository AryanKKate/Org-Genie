const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Connect to MongoDB (ERP database)
const erpConnection = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "erp",
});

erpConnection.on("connected", () => console.log("Connected to ERP database"));
erpConnection.on("error", (err) => console.error("Error connecting to ERP database:", err));

// Define a schema and model for ERP data
const erpSchema = new mongoose.Schema({}, { strict: false });
const ERPModel = erpConnection.model("erp_data", erpSchema, "erp");

// API to list available modules from ERP database
router.get("/list_modules", async (req, res) => {
  try {
    const document = await ERPModel.findOne({}, {});
    if (!document) {
      return res.status(404).json({ error: "No data found" });
    }
    const modules = Object.keys(document.toObject());
    res.json({ available_modules: modules.filter(m => m !== "_id") });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch modules" });
  }
});

// API to fetch structured data based on the selected module
router.get("/check_module/:module", async (req, res) => {
  try {
    const module = req.params.module;
    const document = await ERPModel.findOne({}, { [module]: 1, _id: 0 });

    if (!document || !document[module]) {
      return res.status(404).json({ error: "Module not found or empty" });
    }

    const moduleData = document[module];
    let structuredData = { master_data: [], transactions: [] };

    moduleData.forEach(item => {
      if (item.Customer_ID || item.Supplier_ID || item.Zone_ID || item.Material_ID || item.Checklist_ID || item.Mode_ID) {
        structuredData.master_data.push(item);
      } else if (item.Transaction_ID) {
        structuredData.transactions.push(item);
      }
    });

    res.json(structuredData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

module.exports = router;