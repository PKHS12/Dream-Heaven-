const express = require("express");
const router = express.Router();
const Refund = require("../Models/Refund");

// Get all refunds
router.get("/getall", async (req, res) => {
  try {
    const refunds = await Refund.find();
    res.json(refunds);
  } catch (err) {
    res.status(500).json({ message: "Error fetching refunds" });
  }
});

// Get refund by ID
router.get("/getbyid/:id", async (req, res) => {
    try {
      const refund = await Refund.findById(req.params.id);
      if (!refund) return res.status(404).json({ message: "Refund not found" });
      res.json(refund);
    } catch (err) {
      res.status(500).json({ message: "Error retrieving refund" });
    }
  });
  
  

// Update refund
router.put("/update/:id", async (req, res) => {
    try {
      const updatedRefund = await Refund.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedRefund);
    } catch (err) {
      res.status(500).json({ message: "Error updating refund" });
    }
  });
  

// Delete refund
router.delete("/delete/:id", async (req, res) => {
  try {
    await Refund.findByIdAndDelete(req.params.id);
    res.json({ message: "Refund deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete refund" });
  }
});


module.exports = router;
