const ShopModal = require("../models/shopModel");
const InterestForm = require("../models/interestForm");
const UserModal = require("../models/user");
const Category = require("../models/category");

exports.addShop = async (req, res) => {
  try {
    if (req.files) {
      let img = req.files[0];
      req.body.image = img?.location;
    }

    let shop = await ShopModal.create(req.body);
    res.status(201).json({
      status: "success",
      data: shop,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.getShops = async (req, res) => {
  try {
    let shops = await ShopModal.find({}).populate([
      {
        path: "client",
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

exports.updateShop = async (req, res) => {
  try {
    if (req.files) {
      let img = req.files[0];
      if (img) {
        req.body.image = img?.location;
      }
    }
    let shop = await ShopModal.findByIdAndUpdate(req.params.id, req.body);
    res.status(201).json({
      status: "success",
      data: shop,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.deleteShop = async (req, res) => {
  try {
    let shop = await ShopModal.findByIdAndDelete(req.params.id);
    res.status(201).json({
      status: "success",
      data: shop,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.addInterestForm = async (req, res) => {
  try {
    if (req.files) {
      req.body.form = req.files[0].location;
    }

    let IsAlreadyInterestForm = await InterestForm.find({});
    let interestForm;
    if (IsAlreadyInterestForm?.length > 0) {
      interestForm = await InterestForm.findByIdAndUpdate(
        IsAlreadyInterestForm[0]._id,
        req.body
      );
    } else {
      interestForm = await InterestForm.create(req.body);
    }
    res.status(201).json({
      status: "success",
      data: interestForm,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.getInterestForm = async (req, res) => {
  try {
    let form = await InterestForm.find({});
    res.status(201).json({
      status: "success",
      data: form[0],
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.getCategories = async (req, res) => {
  try {
    let cat = await Category.find({});
    res.status(201).json({
      status: "success",
      data: cat,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.addCategory = async (req, res) => {
  try {
    let cat = await Category.create(req.body);
    res.status(201).json({
      status: "success",
      data: cat,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    let cat = await Category.findByIdAndDelete(req.params.id);
    res.status(201).json({
      status: "success",
      data: cat,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    let cat = await Category.findByIdAndUpdate(req.params.id, req.body);
    res.status(201).json({
      status: "success",
      data: cat,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};
