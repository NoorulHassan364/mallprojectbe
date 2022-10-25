const mongoose = require("mongoose");
const shopSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        price: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        IsSold: {
            type: Boolean,
            default: false
        }
    }
);

const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;
