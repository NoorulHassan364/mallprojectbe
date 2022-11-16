const shopPayments = require("../models/shopPayments");
const userModel = require("../models/user");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getUserShopPaymetns = async (req, res) => {
  try {
    let sPayments = await shopPayments.find({ user: req.params.id });
    res.status(201).json({
      status: "success",
      data: sPayments,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.getCheckOutSessionShopPayment = async (req, res, next) => {
  try {
    let sPayment = await shopPayments.findById(req.params.paymentId);
    let user = await userModel.findById(req.params.userId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "ngn",
            unit_amount: Math.round(sPayment?.amount) * 100,
            product_data: {
              name: `${sPayment?.paymentName}`,
              // description: 'Comfortable cotton t-shirt',
              images: [],
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.SUCCESS_PAYMENT_URL}/shopPayments`,
      cancel_url: `${process.env.CANCEL_PAYMENT_URL}/shopPayments`,
      customer_email: user?.email,
      client_reference_id: `${req.params.paymentId}-shopPayment`,
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
