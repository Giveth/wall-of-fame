import React, { Component } from "react";
import styled, { css } from 'styled-components';

import { Box } from 'grid-styled';

const buttonStyles = css`
  padding: .5rem 1rem;
  border: 2px solid ${({ color }) => color || 'white'};
  background-color: ${({ bgcolor }) => bgcolor || '#2c0d54'};
  border-radius: .25rem;
  cursor: pointer;
  text-align: center;
  font-family: Quicksand;
  font-weight: 600;
  color: ${({ color }) => color || 'white'};
  width: 100%;
  text-decoration: none;
  display: block;
  box-sizing: border-box;
  &:hover {
    background-color: ${({ color }) => color || 'white'};
    color: ${({ bgcolor }) => bgcolor || '#2c0d54'};
  }
`

const StyledButton = styled.div`${buttonStyles}`
const StyledButtonLink = styled.a`${buttonStyles}`

export const Button = (props) => (
  <div>
    <StyledButton {...props}>
      {props.children}
    </StyledButton>
  </div>
)

export const ButtonLink = (props) => (
  <Box {...props}>
    <StyledButtonLink {...props}>
      {props.children}
    </StyledButtonLink>
  </Box>
)
