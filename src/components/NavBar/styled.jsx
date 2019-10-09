import React from 'react';
import styled from 'styled-components';
import { Segment, Menu } from 'semantic-ui-react';
import NavItem from './NavItem';
// eslint-disable-next-line
const StyledNavBar = styled(({ toggleWidth, ...props }) => <Menu {...props} />)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 8vh;
  min-height: 60px !important;
  &:after {
    display: none !important;
  }
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
  @media only screen and (max-width: ${({ toggleWidth }) => toggleWidth - 1}px) {
    justify-content: center;
    flex-direction: column;
    min-height: 0 !important;
    height: auto;
  }
`;

// eslint-disable-next-line
const StyledNavItem = styled(({ toggleWidth, ...props }) => <NavItem {...props} />)`
  padding: 0 0.5em !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  @media only screen and (max-width: ${({ toggleWidth }) => toggleWidth - 1}px) {
    height: 3vh;
    min-height: 60px;
  }
`;

const BarSegment = styled(Segment)`
  height: 4vh;
  max-height: 48px;
  padding-top: 0 !important;
  padding-bottom: 1.35em !important;
  display: flex;
  justify-content: center;
  align-items: center;
`;
// eslint-disable-next-line
const NavBarItemMenu = styled(({ toggleWidth, expanded, ...props }) => <Menu {...props} />)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  height: 100%;
  @media only screen and (max-width: ${({ toggleWidth }) => toggleWidth - 1}px) {
    transition: all 400ms ease-in-out;
    display: block;
    flex-direction: column;
    justify-content: space-around;
    overflow: hidden;
    width: 100%;
    min-height: ${({ children, expanded }) => (expanded ? children.length * 60 : 0)}px !important;
    height: ${({ children, expanded }) => (expanded ? children.length * 3 : 0)}vh;
    border: none !important;
  }
`;

export { StyledNavBar, BarSegment, NavBarItemMenu, StyledNavItem };
