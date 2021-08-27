const Validator = require("validator");
const isEmpty = require("is-empty");

const validateSignUpInput = (data) => {
  const errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.profileImage = !isEmpty(data.profileImage) ? data.profileImage : "";
  //check name
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name is required";
  }

  // check email
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Invalid email";
  }

  // check password
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  } else if (!Validator.isLength(data.password, 8, 15)) {
    errors.password = "Password must be 8 character long";
  }

  // check profile Image
  if (Validator.isEmpty(data.profileImage)) {
    errors.profileImage = "Profile Image is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
module.exports = validateSignUpInput;
