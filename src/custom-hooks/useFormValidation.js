import { useMemo } from "react";
import { formValidationV2 } from "../utils/formValidationFunction";

export const useFormValidation = ({ rulesSchema }) => {
  const { isValid, errorMessage } = useMemo(
    () => formValidationV2(rulesSchema),
    [rulesSchema]
  );

  return {
    isValid,
    errorMessage,
  };
};
