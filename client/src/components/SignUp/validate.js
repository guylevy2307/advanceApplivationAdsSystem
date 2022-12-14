const validator = require("validator");

const validateSignUpForm = (payload) => {
  const errors = {};
  let message = "";
  let isFormValid = true;

  if (
    !payload ||
    typeof payload.email !== "string" ||
    !validator.isEmail(payload.email)
  ) {
    isFormValid = false;
    errors.email = "Please provide a correct email address.";
  }

  if (
    !payload ||
    typeof payload.password !== "string" ||
    payload.password.trim().length < 8
  ) {
    isFormValid = false;
    errors.password = "Password must have at least 8 characters.";
  }

  if (
    !payload ||
    typeof payload.firstName !== "string" ||
    !validator.isAlpha(payload.firstName)
  ) {
    isFormValid = false;
    errors.firstName = "First name should contain only english letters.";
  }

  if (
    !payload ||
    typeof payload.firstName !== "string" ||
    !validator.isAlpha(payload.lastName)
  ) {
    isFormValid = false;
    errors.lastName = "Last name should contain only english letters.";
  }

  if (!isFormValid) {
    message = "Check the form for errors.";
  }

  return {
    success: isFormValid,
    message,
    errors,
  };
};

module.exports = {
  validateSignUpForm: validateSignUpForm,
};
