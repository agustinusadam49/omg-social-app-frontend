const othersValidation = (inputName, inputValue, passwordFromState = "") => {
  if (String(inputName) === "email") {
    if (inputValue.includes("@") && inputValue.includes(".com")) {
      return {
        propertyName: String(inputName),
        propertyValue: inputValue,
        message: null,
        error: false,
      };
    } else {
      return {
        propertyName: String(inputName),
        ropertyValue: inputValue,
        message: "email tidak valid",
        error: true,
      };
    }
  }

  if (String(inputName) === "confirmPassword") {
    if (inputValue === passwordFromState) {
      return {
        propertyName: String(inputName),
        propertyValue: inputValue,
        message: null,
        error: false,
      };
    } else {
      return {
        propertyName: String(inputName),
        ropertyValue: inputValue,
        message: "password tidak sama!",
        error: true,
      };
    }
  }

  if (String(inputName) === "password") {
    const minCharacterLength = 4;
    const maxCharacterLength = 16;
    if (inputValue.length < minCharacterLength) {
      return {
        propertyName: String(inputName),
        propertyValue: inputValue,
        message: `Password tidak boleh kurang dari ${minCharacterLength} character!`,
        error: true,
      };
    }

    if (inputValue.length > maxCharacterLength) {
      return {
        propertyName: String(inputName),
        propertyValue: inputValue,
        message: `Password tidak boleh melebihi dari ${maxCharacterLength} character!`,
        error: true,
      };
    }
  }

  if (String(inputName) === "phoneNumber") {
    const parsedPhoneNumber = parseInt(inputValue);
    if (!parsedPhoneNumber) {
      return {
        propertyName: String(inputName),
        ropertyValue: inputValue,
        message: "Phone number berupa angka!",
        error: true,
      };
    }

    if (inputValue.length > 5 && inputValue.length < 14) {
      return {
        propertyName: String(inputName),
        propertyValue: inputValue,
        message: null,
        error: false,
      };
    } else {
      return {
        propertyName: String(inputName),
        ropertyValue: inputValue,
        message: "Phone number minimal 6 angka dan maximal 13 angka!",
        error: true,
      };
    }
  }
  return {
    propertyName: String(inputName),
    propertyValue: inputValue,
    message: null,
    error: false,
  };
};

const formValidation = (
  arrayToValidateCheck,
  setErrorMessage,
  password = ""
) => {
  const arrayKeys = Object.keys(arrayToValidateCheck);

  const error = {};

  for (let keyIndex = 0; keyIndex < arrayKeys.length; keyIndex++) {
    error[arrayKeys[keyIndex]] = [];
  }

  let validationCount = 0;
  for (let i = 0; i < arrayKeys.length; i++) {
    // Check if field is empty
    if (!arrayToValidateCheck[arrayKeys[i]]) {
      error[arrayKeys[i]].push(`This field cannot be empty.`);
      setErrorMessage(error);
      validationCount++;
    }

    // Check and set requirement in certain field to pass validation
    if (arrayToValidateCheck[arrayKeys[i]]) {
      let otherToValidate = othersValidation(
        arrayKeys[i],
        arrayToValidateCheck[arrayKeys[i]],
        password
      );

      if (otherToValidate.error) {
        error[otherToValidate?.propertyName].push(otherToValidate?.message);
        setErrorMessage(error);
        validationCount++;
      }
    }
  }

  if (validationCount < 1) {
    setErrorMessage(error);
    return true;
  }
};

const helpersWithMessage = (message, value, validationFunc) => {
  const isValid = validationFunc(value);
  return { message, isValid };
};

const getFirstError = (arrError) => {
  const isArrNotEmpty = arrError && arrError.length;
  if (isArrNotEmpty) {
    return arrError[0];
  }

  return arrError;
};

const formValidationV2 = (arrayToValidateCheck) => {
  const arrayKeys = Object.keys(arrayToValidateCheck);
  const error = {};
  let isValid = false;

  for (let keyIndex = 0; keyIndex < arrayKeys.length; keyIndex++) {
    error[arrayKeys[keyIndex]] = [];
  }

  let validationCount = 0;
  for (let i = 0; i < arrayKeys.length; i++) {
    // Check if a field is required
    if (arrayToValidateCheck[arrayKeys[i]].isRequired === true) {
      if (!arrayToValidateCheck[arrayKeys[i]].currentValue) {
        error[arrayKeys[i]].push(`This field cannot be empty.`);
        validationCount++;
      }
    }

    // Check if a field has a function check to validate
    if (arrayToValidateCheck[arrayKeys[i]]?.function) {
      const { message, isValid } = arrayToValidateCheck[arrayKeys[i]]?.function;
      if (!isValid) {
        error[arrayKeys[i]].push(message);
        validationCount++;
      }
    }

    if (Array.isArray(arrayToValidateCheck[arrayKeys[i]])) {
      const arrTemps = arrayToValidateCheck[arrayKeys[i]];
      for (let idx = 0; idx < arrTemps.length; idx++) {
        if (arrTemps[idx].isRequired) {
          if (!arrTemps[idx].currentValue) {
            error[arrayKeys[i]].push(`This field cannot be empty.`);
            validationCount++;
          } else {
            error[arrayKeys[i]].push("");
          }
        }
      }
    }
  }

  if (validationCount < 1) {
    isValid = true
  } else {
    isValid = false
  }

  return {
    isValid,
    errorMessage: error
  }

};

module.exports = {
  formValidation,
  formValidationV2,
  helpersWithMessage,
  getFirstError,
};
