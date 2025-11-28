const mongoose = require("mongoose");
const { checkout } = require("../Routes/roomsRoute");

const bookingSchema = mongoose.Schema({

    room:{
        type:String,
        required:true
    },
    user:{
        type:String,
        required:true
    },
    userid:{
        type:String,
        required:true
    },
    roomid:{
        type:String,
        required:true
    },
    checkindate:{
        type:String,
        required:true
    },
    checkoutdate:{
        type:String,
        required:true
    },
    totalamount:{
        type:Number,
        required:true
    },
    totaldays:{
        type:Number,
        required:true
    },
    transactionId:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:"booked"
    }
},{
    timestamps :true,
})

const bookingmodel = mongoose.model("bookings",bookingSchema);

module.exports = bookingmodel;