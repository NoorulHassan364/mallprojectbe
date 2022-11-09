const leveyModel = require("../models/leveyModel");
const userModel = require("../models/user");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.addLevey = async (req, res) => {
  try {
    if (req.files) {
      req.body.attachment = req.files[0].location;
    }
    let levey = await leveyModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: levey,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.getUserLevey = async (req, res) => {
  try {
    let levey = await leveyModel.find({ user: req.params.id });
    res.status(201).json({
      status: "success",
      data: levey,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.getCheckOutSessionLevey = async (req, res, next) => {
  try {
    let levey = await leveyModel.findById(req.params.leveyId);
    let user = await userModel.findById(req.params.userId);

    // let admission = await admissionModel.create({ ...req.body, admissionFee: college?.admissionFee, collegeId: college?._id, userId: user?._id });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "ngn",
            unit_amount: levey?.amount * 100,
            product_data: {
              name: `${levey?.leveyBillName}`,
              // description: 'Comfortable cotton t-shirt',
              images: [],
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.SUCCESS_PAYMENT_URL}/levey`,
      cancel_url: `${process.env.CANCEL_PAYMENT_URL}/levey`,
      customer_email: user?.email,
      client_reference_id: `${req.params.leveyId}-levey`,
    });

    res.status(200).json({
      status: "success",
      session,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "fail",
    });
  }
};
