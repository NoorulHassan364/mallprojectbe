const mongoose = require("mongoose");
const interestFormSchema = new mongoose.Schema(
    {
        form: {
            type: String,
            required: true,
        }
    }
);

const InterestForm = mongoose.model("InterestForm", interestFormSchema);
module.exports = InterestForm;
