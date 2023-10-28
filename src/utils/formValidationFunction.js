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

const formValidationV2 = (rulesSchemaObj) => {
  const arrayKeys = Object.keys(rulesSchemaObj);
  const error = {};
  let isValid = false;

  for (let keyIndex = 0; keyIndex < arrayKeys.length; keyIndex++) {
    error[arrayKeys[keyIndex]] = [];
  }

  let validationCount = 0;

  for (let i = 0; i < arrayKeys.length; i++) {
    // Check if a field is required
    if (rulesSchemaObj[arrayKeys[i]].isRequired === true) {
      if (!rulesSchemaObj[arrayKeys[i]].currentValue) {
        error[arrayKeys[i]].push(`This field cannot be empty.`);
        validationCount++;
      }
    }

    // Check if a field has a function check to validate
    if (rulesSchemaObj[arrayKeys[i]]?.function) {
      const { message, isValid } = rulesSchemaObj[arrayKeys[i]]?.function;
      if (!isValid) {
        error[arrayKeys[i]].push(message);
        validationCount++;
      }
    }

    // Check if a field has an other function check to validate
    if (rulesSchemaObj[arrayKeys[i]]?.other) {
      const { message, isValid } = rulesSchemaObj[arrayKeys[i]]?.other;
      if (!isValid) {
        error[arrayKeys[i]].push(message);
        validationCount++;
      }
    }

    const isThereAnyValidationCollections = rulesSchemaObj[arrayKeys[i]]?.validationCollections;
    if (isThereAnyValidationCollections) {
      const validationCollections = rulesSchemaObj[arrayKeys[i]]?.validationCollections;
      for (let idx = 0; idx < validationCollections.length; idx++) {
        const { message, isValid } = validationCollections[idx];
        if (!isValid) {
          error[arrayKeys[i]].push(message);
          validationCount++;
        }
      }
    }

    // Check if a field is an array
    if (Array.isArray(rulesSchemaObj[arrayKeys[i]])) {
      const arrTemps = rulesSchemaObj[arrayKeys[i]];
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
    isValid = true;
  } else {
    isValid = false;
  }

  return {
    isValid,
    errorMessage: error,
  };
};

module.exports = {
  formValidationV2,
  helpersWithMessage,
  getFirstError,
};
