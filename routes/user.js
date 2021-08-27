const express = require("express");

const {
  getUserDetails,
  signIn,
  signUp,
} = require("../controllers/userController");

const {authProtect} = require('../controllers/authController');

const UserRoute = express.Router();

UserRoute.post("/sign-up",signUp);
UserRoute.post("/sign-in",signIn);
UserRoute.get('/get-user-details',authProtect,getUserDetails);

module.exports =  UserRoute;