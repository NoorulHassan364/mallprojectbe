const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const UserModel = require("../models/user");
const shopModel = require("../models/shopModel");
const leveyModel = require("../models/leveyModel");

exports.getCheckOutSession = async (req, res, next) => {
  try {
    let shop = await shopModel.findById(req.params.shopId);
    let user = await UserModel.findById(req.params.userId);

    // let admission = await admissionModel.create({ ...req.body, admissionFee: college?.admissionFee, collegeId: college?._id, userId: user?._id });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "ngn",
            unit_amount:
              req.query.type == "buy" ? shop?.price * 100 : shop?.rent * 100,
            product_data: {
              name: `${shop?.name}`,
              // description: 'Comfortable cotton t-shirt',
              images: [shop?.image],
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.SUCCESS_PAYMENT_URL}/shops`,
      cancel_url: `${process.env.CANCEL_PAYMENT_URL}/shops`,
      customer_email: user?.email,
      client_reference_id: `${req.params.shopId}-shop-${req.query.type}`,
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

const createCheckoutBooking = async (session) => {
  let splitRefId = session.client_reference_id.split("-");
  if (splitRefId[1] == "shop") {
    let shopId = splitRefId[0];
    let user = await UserModel.findOne({ email: session.customer_email });
    let shop = await shopModel.findByIdAndUpdate(shopId);

    let date = Date.now();
    let lastRec = await leveyModel
      .find({ user: user?._id, IsPayed: true })
      .sort({ payedDate: -1 });
    if (lastRec?.length == 0) {
      lastRec = 1;
    } else {
      lastRec = parseInt(lastRec[0]?.invoiceNo) + 1;
    }

    await leveyModel.create({
      leveyBillName:
        splitRefId[2] === "buy"
          ? `Bought- ${shop?.name}`
          : `Rent ${shop?.name}`,
      IsPayed: true,
      payedDate: date,
      amount: splitRefId[2] === "buy" ? shop?.price : shop?.rent,
      dueDate: date,
      user: user,
      invoiceNo: lastRec,
    });

    await UserModel.findByIdAndUpdate(user?._id, {
      $push: { purchases: shopId },
    });

    await shopModel.findByIdAndUpdate(shopId, {
      IsSold: true,
      client: user?._id,
    });
  } else {
    let leveyId = splitRefId[0];
    // let user = await UserModel.findOne({ email: session.customer_email });

    // await UserModel.findByIdAndUpdate(user?._id, {
    //   $push: { purchases: shopId },
    // });
    let date = Date.now();
    let currLevey = await leveyModel.findById(leveyId);
    let lastRec = await leveyModel
      .find({ user: currLevey?.user, IsPayed: true })
      .sort({ payedDate: -1 });
    if (lastRec?.length == 0) {
      lastRec = 1;
    } else {
      lastRec = parseInt(lastRec[0]?.invoiceNo) + 1;
    }
    console.log("lastRec", lastRec);
    await leveyModel.findByIdAndUpdate(leveyId, {
      IsPayed: true,
      payedDate: date,
      invoiceNo: lastRec,
    });
  }
};

exports.webhookCheckout = (req, res, next) => {
  console.log("inside webhookCheckout", req.body);
  let event;
  try {
    const signature = req.headers["stripe-signature"];
    console.log("signature", signature);
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      "whsec_315ArVDJNnJd3H6SEaZYyOIQovSV0Duw"
    );
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }
  if (event.type === "checkout.session.completed") {
    createCheckoutBooking(event.data.object);
  }
  res.status(200).json({ received: true });
};

exports.getUserShops = async (req, res) => {
  try {
    let shops = await UserModel.findById(req.params.id).populate([
      {
        path: "purchases",
      },
    ]);
    res.status(201).json({
      status: "success",
      data: shops,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.getShopStatistics = async (req, res) => {
  try {
    let totalShops = await shopModel.find({});
    let soldShops = await shopModel.find({ IsSold: true });

    res.status(201).json({
      status: "success",
      data: {
        totalShops,
        soldShops,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};
