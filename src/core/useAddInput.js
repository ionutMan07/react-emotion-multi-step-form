import { useContext, useCallback } from "react";
import { FormContext } from "./FormContext";

import { validateInputHtml5, validateInputCustom } from '../logic/validateInput';

const useAddInput = ({ 
  label, 
  caption, 
  icon, 
  height, 
  validationRules = {},
  html5Validation = false,
}) => {
  const { addInput } = useContext(FormContext);

  const validateInput = html5Validation ? validateInputHtml5 : validateInputCustom;

  const registerInput = () => {
    const input = {
      label,
      caption,
      icon,
      height,
      validationRules,
      validate: function () {
        return validateInput(this);
      },
    }
    return node => {
      if (node) {
        input.node = node;
        addInput(input);
      }
    };
  }

  const refCallback = useCallback(registerInput());

  return {
    refCallback,
  }
}

export default useAddInput;