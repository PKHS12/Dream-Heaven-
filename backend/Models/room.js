const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    roomType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    occupancy: {
        type: Number,
        required: true
    },
    bedOptions: {
        type: String,
        required: true
    },
    bathrooms: {
        type: String,
        required: true
    },
    amenities: {
        type: [String],
        required: true
    },
    facilities: {
        type: [String],
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    view: {
        type: String,
        required: true
    },
    mealOptions: {
        type: String,
        required: true
    },
    policies: {
        type: [String],
        required: true
    },
    imageurls:[],
    currentbookings:[],
    pricepernight: {
        type: Number,
        required: true
    }
},  {
        timestamps:true,
})

const roomModel = mongoose.model("rooms",roomSchema)

module.exports = roomModel