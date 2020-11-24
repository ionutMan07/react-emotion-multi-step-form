import React, { useRef, useEffect } from "react";
import { css, keyframes } from '@emotion/core';
import styled from "@emotion/styled";
import PropTypes from 'prop-types';

import useInputs from "../core/useInputs";
import useScaleAnimation from "../core/useScaleAnimation";

import Tabs from "./Tabs";
import { IconContainer, IconsWrapper, InputContainer, SubmitLabel, NextButton, NextButtonIcon } from "./StyledComponents";
import Icon from "./Icon";

import { isEmpty } from '../utils/helpers';

const headShake = keyframes`
  0% {
    transform: translateX(0)
  }
  12.5% {
    transform: translateX(6px) rotateY(9deg)
  }
  37.5% {
    transform: translateX(-5px) rotateY(-7deg)
  }
  62.5% {
    transform: translateX(3px) rotateY(5deg)
  }
  87.5% {
    transform: translateX(-2px) rotateY(-3deg)
  }
  100% {
    transform: translateX(0)
  }
`

const bounceRight = keyframes`
  0%,
  100% {
    transform: translate(-8px, -1px);
  }
  50% {
    transform: translate(-2px, -1px);
  }
`

/**
 * When interpolating keyframes into plain strings you have to wrap it in a 
 * css call, like this: css`animation: ${keyframes({ })}`
 * https://github.com/emotion-js/emotion/issues/1066#issuecomment-546703172
 * How to use animation name as a partial (with other properties defined with prop values):
 * https://styled-components.com/docs/api#keyframes
 * How to use animation name inside conditional based on props:
 * https://github.com/styled-components/styled-components/issues/397#issuecomment-275588876
 */
const FormBodyWrapper = styled.div`
  margin-bottom: ${props => props.heightIncrease ? 5 + props.heightIncrease : 5}px;
  filter: blur(0);
  ${props => props.isError ? css`
    animation: ${headShake} .5s  ease-in-out infinite;
  ` : `
    animation: none;
  `}
  &.active {
    transform: translateY(2px);
  }
  &.active > div:last-child {
    box-shadow: 0 2px 2px hsl(120, 60%, 40%);
  }
  * {
    box-sizing: border-box;
  }
`

const PageContainer = styled.div`
  margin: 0px auto;
  max-width: 500px;
  height: 60px;
  ${props => `
    border-bottom-left-radius: ${5 / props.widthScale}px ${5 / props.heightScale}px;
    border-bottom-right-radius: ${5 / props.widthScale}px ${5 / props.heightScale}px;
    ${props.isSubmitPage ? `
      border-top-left-radius: ${5 / props.widthScale}px ${5 / props.heightScale}px;
      border-top-right-radius: ${5 / props.widthScale}px ${5 / props.heightScale}px;
    ` : `
    `}
  `}
  overflow: hidden;
  background-color: hsl(0, 0%, 100%);
  ${props => props.isError ? css`
    box-shadow: 0 ${5 / props.heightScale}px ${5 / props.heightScale}px hsla(16, 100%, 40%, .8);
  ` : `
    box-shadow: 0 ${5 / props.heightScale}px ${5 / props.heightScale}px hsla(120, 60%, 40%, .8);
  `}
  ${props => css`
    transform-origin: center top;
    animation-name: ${keyframes(props.scaleAnimation)};
    animation-duration: 400ms;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  `}
`

const PageWrapper = styled.div`
  padding: 10px 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-evenly;
  align-items: flex-start;
  ${props => css`
    transform-origin: left top;
    animation-name: ${keyframes(props.inverseScaleAnimation)};
    animation-duration: 400ms;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  `}
  &:focus {
    outline: none;
  }
  ${props => props.isSubmitPage ? css`
    width: ${props.submitWidth}px;
    height: 40px;
    border-radius: 5px;
    padding: 10px 3px;
    z-index: 1;
    cursor: pointer;
    &:focus {
      border: 2px solid ${props.theme.colors.light.indigo};
      padding: 8px 1px;
    }
    div {
      pointer-events: none;
    }
    @media (prefers-reduced-motion: no-preference) {
      &:focus > button > div, &:hover > button > div {
        animation: ${bounceRight} .8s ease-in-out infinite;
      }
    }
  ` : `
  `}
`

const FormBody = ({
  tabs = true,
  submitText = 'Submit',
  submitWidth = 110,
  initialFocus = true,
  onSubmit,
  children
}) => {
  const { inputs, activeIndex, changeActiveIndex, activeInput, error, isSubmitPage, inputValues } = useInputs();

  const formBodyWrapperRef = useRef();
  const pageWrapperRef = useRef();
  const buttonRef = useRef();
  const basePageWidthRef = useRef();

  const BASE_PAGE_HEIGHT = 60;
  const SUBMIT_PAGE_HEIGHT = 40;

  const activeInputHeight = (activeInput && activeInput.height) ? activeInput.height : null;
  const pageHeight = activeInputHeight
    ? activeInputHeight
    : isSubmitPage
      ? SUBMIT_PAGE_HEIGHT
      : BASE_PAGE_HEIGHT;
  const pageRelativeHeight = pageHeight / BASE_PAGE_HEIGHT;

  const pageRelativeWidth = isSubmitPage ? submitWidth / basePageWidthRef.current : 1;

  const { scaleAnimation, inverseScaleAnimation } = useScaleAnimation(pageRelativeWidth, pageRelativeHeight);

  const handleAnimationIteration = event => {
    // Manually change DOM node instead of setting state to avoid re-render
    formBodyWrapperRef.current.style.animationPlayState = "paused"
  }

  const handleSubmitClick = event => {
    if (isSubmitPage && event.button === 0) {
      onSubmit(inputValues);
    }
  }

  const handleMouseDownAndUp = event => {
    if (isSubmitPage) {
      if (event.type === 'mousedown' || event.type === 'touchstart') {
        formBodyWrapperRef.current.classList.add('active');
      } else {
        formBodyWrapperRef.current.classList.remove('active');
      }
    }
  }

  const simulateMouseEvent = (element, eventName) => {
    element.dispatchEvent(new MouseEvent(eventName, {
      view: window,
      bubbles: true,
      cancelable: true,
      button: 0
    }));
  };

  const activateAndClick = (event, target) => {
    if (event.repeat) return;
    const node = target || event.currentTarget;
    node.classList.add('active');

    const handleKeyUp = event => {
      node.classList.remove('active');
      simulateMouseEvent(node, 'click')
      pageWrapperRef.current.removeEventListener('keyup', handleKeyUp, false);
    }
    pageWrapperRef.current.addEventListener('keyup', handleKeyUp, false);
  }

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      if (!isSubmitPage) {
        activateAndClick(event, buttonRef.current);
      } else {
        activateAndClick(event, formBodyWrapperRef.current); // just to add 'active' class
        activateAndClick(event, pageWrapperRef.current);
      }
    }
  }

  const handleNextButtonClick = event => {
    changeActiveIndex(activeIndex + 1);
  };

  const handleNextButtonKeyDown = event => {
    // replace default behaviour with clickButtonOnKeyDown to streamline behaviour between Enter and Space keys
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      // stop Enter or Space keys from triggering FormBody keydown handler
      event.stopPropagation();
      activateAndClick(event);
    }
  }

  useEffect(() => {
    const boundingClientRect = pageWrapperRef.current.getBoundingClientRect();
    basePageWidthRef.current = boundingClientRect.width;
  }, [pageWrapperRef.current]);

  useEffect(() => {
    if (error.state) formBodyWrapperRef.current.style.animationPlayState = "running";
  }, [error]);

  useEffect(() => {
    if (inputs.length === 0) return;

    // don't focus on initial render of form if initialFocus is false
    if (!initialFocus && activeIndex === 0 && isEmpty(activeInput.value)) return;
    if (!isSubmitPage) {
      setTimeout(() => activeInput.node.focus(), 450);
    } else {
      setTimeout(() => pageWrapperRef.current.focus(), 450);
    }
  }, [inputs.length, initialFocus, activeIndex, activeInput, isSubmitPage])

  return (
    <FormBodyWrapper
      ref={formBodyWrapperRef}
      heightIncrease={activeInputHeight ? activeInputHeight - BASE_PAGE_HEIGHT : null}
      isError={error.state}
      onAnimationIteration={handleAnimationIteration}
    >
      {tabs
        ? <Tabs
          basePageWidth={basePageWidthRef.current}
          inputs={inputs}
          activeIndex={activeIndex}
          changeActiveIndex={changeActiveIndex}
          activeInput={activeInput}
          isSubmitPage={isSubmitPage}
        />
        : null
      }
      <PageContainer
        isError={error.state}
        widthScale={pageRelativeWidth}
        heightScale={pageRelativeHeight}
        scaleAnimation={scaleAnimation}
        isSubmitPage={isSubmitPage}
      >
        <PageWrapper
          ref={pageWrapperRef}
          role={isSubmitPage ? "button" : null}
          tabIndex={isSubmitPage ? "0" : "-1"}
          inverseScaleAnimation={inverseScaleAnimation}
          isSubmitPage={isSubmitPage}
          submitWidth={submitWidth}
          onClick={handleSubmitClick}
          onKeyDown={handleKeyDown}
          onMouseDown={handleMouseDownAndUp}
          onMouseUp={handleMouseDownAndUp}
          onTouchStart={handleMouseDownAndUp}
          onTouchEnd={handleMouseDownAndUp}
        >
          <IconContainer>
            <IconsWrapper index={Math.min(activeIndex, inputs.length - 1)}>
              {(inputs.length > 0) 
                ? inputs.map((input, index) => (
                  <Icon key={`${index}${input.name}`} IconComponent={input.icon} isSubmitPage={isSubmitPage} />
                ))
                : null
              }
            </IconsWrapper>
          </IconContainer>
          <InputContainer pageContainerheight={activeInputHeight}>
            {children}
            <SubmitLabel text={submitText} isSubmitPage={isSubmitPage} />
          </InputContainer>
          <NextButton
            ref={buttonRef}
            type="button"
            disabled={isSubmitPage}
            onClick={handleNextButtonClick}
            onKeyDown={handleNextButtonKeyDown}
          >
            <NextButtonIcon />
          </NextButton>
        </PageWrapper>
      </PageContainer>
    </FormBodyWrapper>
  )
};

FormBody.propTypes = {
  initialFocus: PropTypes.bool,
  onSubmit: PropTypes.func,
  submitText: PropTypes.string,
  submitWidth: PropTypes.number,
}

export default FormBody;