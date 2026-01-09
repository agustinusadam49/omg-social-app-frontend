import {
  formValidationV2,
  getFirstError,
} from "../utils/formValidationFunction";

export const useFormValidation = ({ rulesSchema }) => {
  const { isValid, errorMessage } = formValidationV2(rulesSchema);

  const handleInputErrorMessage = (type) => {
    return getFirstError(errorMessage[type]);
  };

  return {
    isValid,
    errorMessage,
    handleInputErrorMessage,
  };
};
