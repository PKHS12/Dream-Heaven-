const mongoose = require("mongoose");

const cancellationSchema = mongoose.Schema({
    
    room: {
        type:String,
        required:true
    },
    bookingid: { 
        type: String,
        required: true
     },
    roomid: { 
        type: String, 
        required: true 
    },
    user:{
        type: String, 
        required: true 
    },
    userid: {
         type: String, 
         required: true 
    },
    checkindate: { 
        type: String, 
        required: true 
    },
    checkoutdate: { 
        type: String, 
        required: true 
    },
    totalamount:{
        type: Number, 
        required: true 
    },
    bookeddate: { 
        type: Date, 
        required: true 
    },
    cancelleddate: { 
        type: Date, 
        required: true 
    },
    totaldays: { 
        type: Number, 
        required: true 
    },
    status: {
        type: String,
        default: 'pending cancellation',
        enum: ['pending cancellation', 'cancelled']
    },
    bankName: { 
        type: String, 
        required: true 
    },
    branchName: { 
        type: String, 
        required: true },
    accountHolder: { 
        type: String, 
        required: true 
    },
    bankAccount: { 
        type: String, 
        required: true 
    },
    
}, { timestamps: true });

const Cancellation = mongoose.model("Cancellation", cancellationSchema);

module.exports = Cancellation;