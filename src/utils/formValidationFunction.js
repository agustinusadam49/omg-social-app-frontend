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

const formValidationV2 = (schema) => {
  const keys = Object.keys(schema);
  const error = {};
  let isValid = false;

  for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
    error[keys[keyIndex]] = [];
  }

  let validationCount = 0;

  for (let i = 0; i < keys.length; i++) {
    const fieldItemIsRequired = schema[keys[i]].isRequired;
    const fieldItemCurrentValue = schema[keys[i]].currentValue;
    const fieldItemFunction = schema[keys[i]]?.function;
    const fiedlItemOther = schema[keys[i]]?.other;
    const fieldItemValidCollections = schema[keys[i]]?.validationCollections;

    // Check if a field is required
    if (fieldItemIsRequired && !fieldItemCurrentValue) {
      error[keys[i]].push(`This field cannot be empty.`);
      validationCount++;
    }

    // Check if a field has a function check to validate
    if (fieldItemFunction) {
      const { message, isValid } = fieldItemFunction;
      if (!isValid) {
        error[keys[i]].push(message);
        validationCount++;
      }
    }

    // Check if a field has an other function check to validate
    if (fiedlItemOther) {
      const { message, isValid } = fiedlItemOther;
      if (!isValid) {
        error[keys[i]].push(message);
        validationCount++;
      }
    }

    // Check if one of props ruleSchema have some validationCollections
    if (fieldItemValidCollections) {
      for (let idx = 0; idx < fieldItemValidCollections.length; idx++) {
        const { message, isValid } = fieldItemValidCollections[idx];
        if (!isValid) {
          error[keys[i]].push(message);
          validationCount++;
        }
      }
    }

    // Check if a field is an array
    if (Array.isArray(schema[keys[i]])) {
      const arrTemps = schema[keys[i]];
      for (let idx = 0; idx < arrTemps.length; idx++) {
        if (arrTemps[idx].isRequired) {
          if (!arrTemps[idx].currentValue) {
            error[keys[i]].push(`This field cannot be empty.`);
            validationCount++;
          } else {
            error[keys[i]].push("");
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
