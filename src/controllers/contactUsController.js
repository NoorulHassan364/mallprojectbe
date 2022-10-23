const contactUsModel = require("../models/contactUs");

exports.addContact = async (req, res) => {
    try {
        let contact = await contactUsModel.create(req.body);
        res.status(201).json({
            status: "success",
            data: contact
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
}
