import React from 'react';
import styled from 'styled-components';
import { Segment, Menu } from 'semantic-ui-react';
const StyledNavBar = styled(Menu)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 8vh;
  min-height: 60px !important;
  transition: height 400ms ease-in-out;
  &:after {
    display: none !important;
  }
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
`;

const BarSegment = styled(Segment)`
  height: 4vh;
  max-height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
// eslint-disable-next-line
const NavBarItemMenu = styled(({ toggleWidth, expanded, ...props }) => <Menu {...props} />)`
  @media only screen and (max-width: ${({ toggleWidth }) => toggleWidth - 1}px) {
    height: ${({ expanded, children }) => (expanded ? children.length * 48 : 0)}px;
  }
`;

export { StyledNavBar, BarSegment, NavBarItemMenu };
