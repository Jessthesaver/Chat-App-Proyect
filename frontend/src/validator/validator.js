import validate from "validator";
import { t } from "i18next";

export const validator = (values, fieldName, existence) => {
  let errors = {};
  switch (fieldName) {
    case "username":
      validateUsername(values.username, errors, existence);
      break;
    case "name":
      validateName(values.name, errors);
      break;
    case "email":
      validateEmail(values.email, errors, existence);
      break;
    case "password":
      validatePassword(values.password, values.confirmPassword, errors);
      break;
    case "passwordLog":
      validatePasswordLog(values.passwordLog, errors);
      break;
    case "confirmPassword":
      validateConfirmPassword(values.password, values.confirmPassword, errors);
      break;
    default:
      break;
  }
  return errors;
};

function validateName(firstName, errors) {
  let result = true;

  if (!firstName || firstName.trim() === "") {
    errors.firstName = t("nameError");
    result = false;
  }

  return result;
}

function validateUsername(username, errors, existence) {
  let result = true;
  if (!username || username.trim() === "") {
    errors.username = t("usernameError");
    result = false;
  }

  if (username[0] === " ") {
    errors.username = t("usernameError2");
    result = false;
  }

  if (existence?.username) {
    errors.username = t("usernameExistsError");
    result = false;
  }

  return result;
}

function validatePassword(password, confirmPassword, errors) {
  let result = true;
  const valid = validate.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    returnScore: true,
    pointsPerUnique: 1,
    pointsPerRepeat: 0.5,
    pointsForContainingLower: 10,
    pointsForContainingUpper: 10,
    pointsForContainingNumber: 10,
    pointsForContainingSymbol: 10,
  });
  if (!password) {
    errors.password = t("passwordErrorReq");
    result = false;
  } else if (valid < 50) {
    errors.password = t("passwordError");
  } else if (password && valid > 50 && confirmPassword.trim() !== "") {
    validateConfirmPassword(password, confirmPassword, errors);
  }

  return result;
}

function validatePasswordLog(password, errors) {
  let result = true;
  if (!password) {
    errors.password = t("passwordErrorReq");
    result = false;
  }

  return result;
}

function validateConfirmPassword(password, confirmPassword, errors) {
  let result = true;

  if (!confirmPassword) {
    errors.confirmPassword = t("confirmPasswordErrorReq");
    result = false;
  } else if (password !== confirmPassword) {
    errors.confirmPassword = t("confirmPasswordError");
    errors.password = t("confirmPasswordError");

    result = false;
  }
  return result;
}

function validateEmail(email, errors, existence) {
  let result = true;
  if (!email) {
    errors.email = t("emailErrorReq");
    result = false;
  } else if (existence.email) {
    errors.email = t("emailExistsError");
    result = false;
  } else {
    result = validate.isEmail(String(email).toLocaleLowerCase());
    if (!result) errors.email = t("emailError");
  }
  return result;
}
