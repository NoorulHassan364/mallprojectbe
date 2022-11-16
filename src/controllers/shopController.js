const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const UserModel = require("../models/user");
const shopModel = require("../models/shopModel");
const leveyModel = require("../models/leveyModel");
const shopPayments = require("../models/shopPayments");

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
              req.query.type == "buy"
                ? shop?.price * 100
                : Math.round((parseInt(shop?.price) / 100) * 20) * 100,
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
      success_url: `${process.env.SUCCESS_PAYMENT_URL}/shopPayments`,
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
  let user = await UserModel.findOne({ email: session.customer_email });
  if (splitRefId[1] == "shop") {
    let shopId = splitRefId[0];
    let shop = await shopModel.findByIdAndUpdate(shopId);

    let date = new Date();

    let lastRec = await shopPayments
      .find({ user: user?._id, IsPayed: true })
      .sort({ payedDate: -1 });
    if (lastRec?.length == 0) {
      lastRec = 1;
    } else {
      lastRec = parseInt(lastRec[0]?.invoiceNo) + 1;
    }

    await shopPayments.create({
      paymentName:
        splitRefId[2] === "buy"
          ? `${shop?.name} (Bought)`
          : `${shop?.name} (20%)`,
      IsPayed: true,
      payedDate: date,
      amount:
        splitRefId[2] === "buy"
          ? shop?.price
          : Math.round((parseInt(shop?.price) / 100) * 20),
      dueDate: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
      user: user,
      shop: shop?._id,
      invoiceNo: lastRec,
    });

    if (splitRefId[2] == "20Percent") {
      let arr = [];
      let curDate = new Date();
      let currMonth = curDate.getMonth() + 1;
      let currYear = curDate.getFullYear();

      let monthlyInstallment = Math.round(
        ((parseInt(shop?.price) / 100) * 80) / 84
      );

      for (let i = 1; i < 85; i++) {
        currMonth += 1;
        if (currMonth == 13) {
          // arr.push(
          await shopPayments.create({
            paymentName: `${i}-Installment (${shop?.name})`,
            IsPayed: false,
            payedDate: "",
            amount: monthlyInstallment,
            dueDate: `${1}-${1}-${currYear + 1}`,
            user: user,
            shop: shop?._id,
            invoiceNo: "",
          });

          // );
          currMonth = 1;
          currYear += 1;
        } else {
          await shopPayments.create({
            paymentName: `${i}-Installment (${shop?.name})`,
            IsPayed: false,
            payedDate: "",
            amount: monthlyInstallment,
            dueDate: `${1}-${currMonth}-${currYear}`,
            user: user,
            shop: shop?._id,
            invoiceNo: "",
          });
          // arr.push(

          // );
        }
      }

      await shopPayments.create(arr);
    }

    await UserModel.findByIdAndUpdate(user?._id, {
      $push: { purchases: shopId },
    });

    if (splitRefId[2] == "20Percent") {
      await shopModel.findByIdAndUpdate(shopId, {
        client: user?._id,
        onInstallment: true,
      });
    } else {
      await shopModel.findByIdAndUpdate(shopId, {
        IsSold: true,
        client: user?._id,
      });
    }
  } else if (splitRefId[1] == "shopPayment") {
    let paymentId = splitRefId[0];

    let date = Date.now();
    let lastRec = await shopPayments
      .find({ user: user?._id, IsPayed: true })
      .sort({ payedDate: -1 });
    if (lastRec?.length == 0) {
      lastRec = 1;
    } else {
      lastRec = parseInt(lastRec[0]?.invoiceNo) + 1;
    }

    await shopPayments.findByIdAndUpdate(paymentId, {
      IsPayed: true,
      payedDate: date,
      invoiceNo: lastRec,
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
    let installmentShops = await shopModel.find({ onInstallment: true });

    res.status(201).json({
      status: "success",
      data: {
        totalShops,
        soldShops,
        installmentShops,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};
