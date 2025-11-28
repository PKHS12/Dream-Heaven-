const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema({
  cancellationid: {
    type: String,
    required: true,
  },
  user:{
    type: String,
    required: true
  },
  userid:{
    type: String,
    required: true
  },
  room: {
    type: String,
    required: true
  },
  bookingid: { 
    type: String,
    required: true
 },
  cancelApprovedDate: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  refundDate: {
    type: Date,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  bankHolderName: {
    type: String,
    required: true,
  },
  accountNo: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'done'],
    default: 'pending',
  },
});

module.exports = mongoose.model("Refund", refundSchema);
