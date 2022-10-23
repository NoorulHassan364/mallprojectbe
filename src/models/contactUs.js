const mongoose = require("mongoose");

const ContactUsSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    message: {
        type: String,
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});


const ContactUs = mongoose.model("ContactUs", ContactUsSchema);

module.exports = ContactUs;
