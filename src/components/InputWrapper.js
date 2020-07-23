import React, { useRef } from "react";
import styled from "@emotion/styled";

import log from "../tests/log";
import useActiveIndex from "../hooks/useActiveIndex";

const StyledInputWrapper = styled.div`
  max-width: 500px;
  min-height: 40px;
  max-height: 220px;
  display: flex;
  flex-flow: ${props => props.column ? 'column nowrap' : 'row nowrap'};
  justify-content: space-evenly;
  align-items: center;
  font-size: 1.125rem;
  outline: none;
  ${props => props.isActive ? `
    visibility: visible;
    opacity: 1;
    transition: opacity 600ms ease-out;
  ` : ` 
    position: absolute;
    visibility: hidden;
    opacity: 0;
  `}
`;

const InputWrapper = ({ name, inputRef, column, children }) => {
  console.log(`InputWrapper Rendered! for ${name}`);
  const { activeInput } = useActiveIndex();
  const isActiveRef = useRef(false);
  // const [isActive, setIsActive] = useState(false);

  // useEffect(() => {
  //   console.log(`InputWrapper Effect Ran for ${name}!`);
  //   console.log(activeInput);
  //   if (activeInput) {
  //     const activeInputNode = activeInput.node;
  //     const activeInputName = activeInputNode.name || activeInputNode.dataset.name;
  //     const isActive = name === activeInputName;
  //     setIsActive(isActive);
  //   } else {
  //     setIsActive(false);
  //   }
  // }, [activeInput]);
  console.log(activeInput);
  if (activeInput) {
    const activeInputNode = activeInput.node;
    const activeInputName = activeInputNode.name || activeInputNode.dataset.name;
    isActiveRef.current = name === activeInputName;
    console.log(`${name} active: ${isActiveRef.current}`);
  } else {
    isActiveRef.current = false;
  };

  return (
    <StyledInputWrapper
      data-name={name}
      ref={inputRef}
      tabIndex={-1}
      column={column}
      isActive={isActiveRef.current}
    >
      {children}
    </StyledInputWrapper>
  )
}

export default InputWrapper;