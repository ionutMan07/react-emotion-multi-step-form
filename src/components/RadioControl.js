import React from "react";
import styled from "@emotion/styled";
import PropTypes from 'prop-types';
import inputPropTypes from '../propTypes'

import useAddInput from "../core/useAddInput";
import useInputState from "../core/useInputState";

import InputWrapper from "./InputWrapper";

const StyledLabel = styled.label`
  display: inline-block;
  margin: 0 2px;
  padding: 0 10px;
  border-radius: 25px;
  text-align: center;
  text-transform: capitalize;
  cursor: pointer;
  transition: border 0.1s;
  ${props => `
    border: 1px solid white;
    color: ${props.theme.colors.extraDark[props.color]};
    ${props.isChecked ? `
      color: ${props.theme.colors.white};
      background: ${props.theme.colors.dark[props.color]};
      border: 1px solid ${props.theme.colors.light[props.color]};
    ` : `
      background: ${props.theme.colors.white};
      &:hover {
        border: 1px solid ${props.theme.colors.base[props.color]};
      }
    `}
  `}
`;

const HiddenRadio = styled.input`
  position: absolute;
  margin: -1px;
  border: 0;
  padding: 0;
  overflow: hidden;
  white-space: nowrap;
  clip-path: inset(50%);
`;

const RadioWrapper = styled.div`
  line-height: 2rem;
  input:focus + label {
    box-shadow: ${props => `0 0 0 2px ${props.theme.colors.light[props.color]}`};
  }
`

export const RadioOption = ({
  name,
  value,
  label,
  isChecked,
  handleChange,
}) => (
  <RadioWrapper color="indigo">
    <HiddenRadio
      type="radio"
      name={name}
      id={value}
      value={value}
      onChange={handleChange}
    />
    <StyledLabel
      htmlFor={value}
      isChecked={isChecked}
      color="indigo"
    >
      {label || value}
    </StyledLabel>
  </RadioWrapper>
);

RadioOption.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  label: PropTypes.string,
};

export const RadioControl = ({
  name,
  onChange,
  height,
  label,
  caption,
  icon,
  validationRules,
  children,
}) => {
  const { refCallback } = useAddInput({ label, caption, icon, height, validationRules });
  const { value, setValue } = useInputState(name, '');

  const handleChange = event => {
    const value = event.target.value;
    if (onChange) onChange(value);
    setValue(value);
  }

  return (
    <InputWrapper name={name} inputRef={refCallback}>
      {React.Children.map(children, child => {
        if (child.type === RadioOption) {
          return React.cloneElement(child, {
            name: name,
            isChecked: child.props.value === value,
            handleChange: handleChange,
          });
        }
        return child;
      })}
    </InputWrapper>
  )
}

RadioControl.propTypes = {
  ...inputPropTypes,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};