import React, { Component } from "react";
import styled from 'styled-components';

import { Box } from 'grid-styled';
import ReactARIAToolTip from 'react-aria-tooltip';

const Styles = styled.div`
  font-family: Quicksand;
  font-weight: 600;
  width: 100%;
`

export const Tooltip = (props) => (
  <Box {...props}>
    <Styles>
      <ReactARIAToolTip {...props}>
        {props.children}
      </ReactARIAToolTip>
    </Styles>
  </Box>
)
