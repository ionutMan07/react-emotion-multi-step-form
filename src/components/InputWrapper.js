import React from "react";
import styled from "@emotion/styled";

import useInputs from "../core/useInputs";

const StyledInputWrapper = styled.div`
  height: 100%;
  line-height: 1.625rem;
  font-size: 1.125rem;
  display: flex;
  ${props => props.column ? `
    flex-flow: column nowrap;
    justify-content: flex-start;
  ` : `
    flex-flow: row wrap;
    justify-content: space-evenly;
  `}
  align-items: center;
  outline: none;
  ${props => props.isActive ? `
    visibility: visible;
    opacity: 1;
    transition: opacity 400ms ease-out;
  ` : ` 
    position: absolute;
    visibility: hidden;
    opacity: 0;
  `}
    input, label, button, select, optgroup, textarea  {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }
`;

const InputWrapper = ({ name, inputRef, column, onKeyDown, children }) => {
  const { activeInput } = useInputs();

  let isActive = false;
  if (activeInput) {
    const activeInputNode = activeInput.node;
    const activeInputName = activeInputNode.name || activeInputNode.dataset.name;
    isActive = name === activeInputName;
  } else {
    isActive = false;
  };

  return (
    <StyledInputWrapper
      ref={inputRef}
      data-name={name}
      tabIndex={-1}
      column={column}
      isActive={isActive}
      onKeyDown={onKeyDown}
    >
      {children}
    </StyledInputWrapper>
  )
}

export default InputWrapper;