import styled from "@emotion/styled";
// Note: https://emotion.sh/docs/styled#styling-any-component

export const StyledForm = styled.div`
  margin: 100px auto;
  box-sizing: content-box;
  width: 900px;
  height: 500px;
  border: 3px double hsl(0, 0%, 13%); 
  text-align: center;
  perspective: 800px;
  ${props => `background: ${props.theme.colors.light.turqoise};`}
  &:after {
    content: " 🦄";
  }
`

export const Heading = styled.h1`
  margin: 50px 0 15px 0;
  font-size: 1.875rem;
`

export const TitleContainer = styled.div`
  font-size: 1.5rem;
  line-height: 1;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
`
export const ErrorMessage = styled.div`
  margin: 0 auto 5px auto;
  height: 20px;
  line-height: 20px;
  font-size: 1.125rem;
  color: hsl(16, 100%, 40%);
`

export const IconContainer = styled.div`
  height: 40px;
  width: 34px;
  overflow: hidden;
  ${props => (props.page === 4) ? 'display: none' : ''};
`

export const IconWrapper = styled.div`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  line-height: 40px;
  transition: top 300ms ease-out;
  ${props => (
    (props.page === 1) ? `
      top: 0px;
    ` : (props.page === 2) ? ` 
      top: -40px; 
    ` : ` 
      top: -80px;
    `
  )}
`

export const InputContainer = styled.div`
  position: relative;
  margin: 0 8px;
  height: 220px;
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  ${props => (props.page === 4) ? 'display: none' : ''};
`

export const InputWrapper = styled.div`
  max-width: 500px;
  min-height: 40px;
  max-height: 220px;
  overflow: hidden;
  display: flex;
  flex-flow: ${props => props.column ? 'column nowrap' : 'row wrap'};
  justify-content: space-evenly;
  align-items: center;
  font-size: 1.125rem;
  ${props => props.active ? `
    visibility: visible;
    opacity: 1;
    transition: opacity 600ms ease-out;
  ` : ` 
    position: absolute;
    visibility: hidden;
    opacity: 0;
  `}
`;

export const StyledInput = styled.input`
  width: 100%;
  height: 40px;
  border: none;
  padding: 2px 0 0 0;
  outline: none;
  letter-spacing: 1px;
`;

export const NextButton = styled.button`
  position: relative;
  height: 40px;
  width: 34px;
  border: 1px black;
  background: none;
  outline: none;
  cursor: pointer;
  transition: transform 400ms;
  &:hover {
    background: hsl(0, 0%, 90%);
    border-radius: 3px;
    transition: background 0.3s ease, transform 400ms;
  }
  ${props => (props.page === 4) ? `
    transform: rotate(-90deg);
  ` : `
    &:active {
      top: 3px;
      background-color: hsl(0, 0%, 100%);
      transition-property: none;
    }
  `}
`

export const NextButtonIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 17px;
  background: hsl(0, 0%, 20%);
  &::before {
    content: '';
    position: absolute;
    left: -2px;
    bottom: 1px;
    width: 6px;
    height: 6px;
    transform: rotate(45deg);
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: hsl(0, 0%, 20%);
  }
`