const express = require('express');
const router = express.Router();
const Feedback = require('../Models/feedback');

// Submit feedback
router.post('/submit', async (req, res) => {
  try {
    const { userId, userName, userEmail, rating, comment, category } = req.body;
    
    if (!userId || !userName || !userEmail || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    if (comment.length > 500) {
      return res.status(400).json({ message: 'Comment must be less than 500 characters' });
    }

    const feedback = new Feedback({
      userId,
      userName,
      userEmail,
      rating,
      comment,
      category: category || 'General'
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('Feedback submission error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all feedback (for admin)
router.get('/all', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get approved feedback (for public display)
router.get('/approved', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update feedback status (admin only)
router.put('/update-status/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.json({ message: 'Status updated successfully', feedback });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete feedback (admin only)
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const feedback = await Feedback.findByIdAndDelete(id);
    
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get feedback statistics
router.get('/stats', async (req, res) => {
  try {
    const totalFeedbacks = await Feedback.countDocuments();
    const approvedFeedbacks = await Feedback.countDocuments({ status: 'approved' });
    const pendingFeedbacks = await Feedback.countDocuments({ status: 'pending' });
    const rejectedFeedbacks = await Feedback.countDocuments({ status: 'rejected' });
    
    const avgRating = await Feedback.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    
    res.json({
      total: totalFeedbacks,
      approved: approvedFeedbacks,
      pending: pendingFeedbacks,
      rejected: rejectedFeedbacks,
      averageRating: avgRating[0]?.avgRating || 0
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
