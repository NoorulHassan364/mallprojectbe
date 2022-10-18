const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class Auth {
  signup = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          status: "error",
          message: "email already exist!",
        });
      }


      const data = await User.create(req.body);

      res.status(201).json({
        status: "success",
        message: "signup successfully!",
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };


  // create and send token
  cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  createSendToken = (user, statusCode, res) => {
    // console.log("user, statusCode, res", user, statusCode, res);
    const token = this.signToken(user._id);
    // res.cookie("jwt", token, this.cookieOptions);
    user.password = undefined;
    // console.log("token", token);

    res.status(statusCode).json({
      status: "success",
      token,
      user: user,
    });
    // let decoded = jwt_decode(token);
    // console.log("decoded", decoded);
  };

  // creating token
  signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };

  // user login
  LogIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).send("incorrect email or password")
      }
      const user = await User.findOne({ email });
      if (!user || !(await user.correctPassword(password, user.password))) {
        res.status(401).send("incorrect email or password")
      } else {
        this.createSendToken(user, 200, res);
      }
    } catch (error) {
      console.log(error);
    }

  };


  getUser = async (req, res) => {
    try {
      const resUser = await User.findById(req.params.id);
      return res.status(200).json({
        status: "success",
        data: resUser,
        // message: "deposit Successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  updateUser = async (req, res) => {
    try {
      const resUser = await User.findByIdAndUpdate(req.params.id, req.body);
      return res.status(200).json({
        status: "success",
        data: resUser,
        // message: "deposit Successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  changePassword = async (req, res) => {
    try {
      let user = await User.findById(req.params.id);
      if (await user.correctPassword(req.body.oldPassword, user.password)) {
        let pass = await bcrypt.hash(req.body.newPassword, 10);
        const resUser = await User.findByIdAndUpdate(req.params.id, { password: pass });
        return res.status(200).json({
          status: "success",
          data: resUser,
        });
      }

    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };
}



module.exports = new Auth();
