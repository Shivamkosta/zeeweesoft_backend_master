const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

const validateSignUpInput = require("../validator/user/signUp.validator");
const services = require("../utils/services");
const base64ToFileUrl = require("../utils/base64ToFile");

// User SignUp
exports.signUp = async (req, res) => {
  const { errors, isValid } = validateSignUpInput(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res
        .status(409)
        .json({ errors: { email: "Email already exists" } });
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
    });
    const profileImageUrl = await base64ToFileUrl(
      req.body.profileImage,
      newUser._id,
      "profileImage"
    );
    newUser.profileImg = profileImageUrl;
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.log("err: ", err);
        return res.status(500).json({ error: err });
      }
      bcrypt.hash(req.body.password, salt, async (err, hash) => {
        if (err) {
          console.log("err: ", err);
          return res.status(500).json({ error: err });
        }

        newUser.password = hash;
        await newUser.save();

        const payload = {
          _id: newUser._id,
          email: newUser.email,
          name: newUser.name,
        };

        const token = jwt.sign(payload, services.JWT_KEY, {
          expiresIn: 31556926,
        });
        return res.status(200).json({
          message: "User registered successfully",
          token: token,
        });
      });
    });
  } catch (err) {
    console.log("SignUp: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// User SignIn
exports.signIn = async (req, res) => {
  const { errors, isValid } = validateSignUpInput(req.body);
  try {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const details = {};
    if (req.body.email.match(regex)) {
      details.email = req.body.email;
    } else {
      details.name = req.body.name;
    }

    const user = await User.findOne(details);
    if (!user) {
      return res.status(401).json({ errors: { email: "User not found" } });
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({ error: "Invalid Password" });
    }
    const payload = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };
    const token = jwt.sign(payload, services.JWT_KEY, {
      expiresIn: 31556926,
    });
    return res.status(200).json({
      message: "User logged in seccessfully",
      token: token,
    });
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).json({ error: "Inernal Server Error" });
  }
};

// GetUserDetails
exports.getUserDetails = async (req, res) => {
  const userId = req.query.userId || req.user._id;

  try {
    const userDetails = await User.findById(userId);
    res.status(200).json({ user: userDetails });
  } catch (err) {
    console.log("GetUserDetails: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
