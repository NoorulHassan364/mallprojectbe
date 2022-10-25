
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const UserModel = require("../models/user");
const shopModel = require("../models/shopModel");

exports.getCheckOutSession = async (req, res, next) => {
    try {
        let shop = await shopModel.findById(req.params.shopId);
        let user = await UserModel.findById(req.params.userId);

        // let admission = await admissionModel.create({ ...req.body, admissionFee: college?.admissionFee, collegeId: college?._id, userId: user?._id });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'ngn',
                    unit_amount: shop?.price * 100,
                    product_data: {
                        name: `${shop?.name}`,
                        // description: 'Comfortable cotton t-shirt',
                        images: [shop?.image],
                    },
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.SUCCESS_PAYMENT_URL}`,
            cancel_url: `${process.env.CANCEL_PAYMENT_URL}`,
            customer_email: user?.email,
            client_reference_id: req.params.shopId,
        });

        res.status(200).json({
            status: 'success',
            session
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 'fail',
        })
    }
};

const createCheckoutBooking = async (session) => {
    let shopId = session.client_reference_id;
    let user = await UserModel.findOne({ email: session.customer_email });

    await UserModel.findByIdAndUpdate(user?._id, {
        $push: { purchases: shopId }
    })

    await shopModel.findByIdAndUpdate(shopId, { IsSold: true })
};

exports.webhookCheckout = (req, res, next) => {
    console.log('inside webhookCheckout', req.body);
    let event;
    try {
        const signature = req.headers['stripe-signature'];
        console.log("signature", signature)
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            'whsec_315ArVDJNnJd3H6SEaZYyOIQovSV0Duw'
        )
    } catch (error) {
        return res.status(400).send(`Webhook error: ${error.message}`)
    }
    if (event.type === 'checkout.session.completed') {
        createCheckoutBooking(event.data.object)
    }
    res.status(200).json({ received: true })
}
