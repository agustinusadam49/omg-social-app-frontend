import { useMemo } from "react";
import { formValidationV2 } from "../utils/formValidationFunction";
import { getFirstError } from "../utils/formValidationFunction";

export const useFormValidation = ({ rulesSchema }) => {
  const { isValid, errorMessage } = useMemo(
    () => formValidationV2(rulesSchema),
    [rulesSchema]
  );

  const handleInputErrorMessage = (type) => {
    return getFirstError(errorMessage[type]);
  };

  return {
    isValid,
    errorMessage,
    handleInputErrorMessage,
  };
};
