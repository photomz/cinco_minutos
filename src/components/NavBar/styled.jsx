import React from 'react';
import styled from 'styled-components';
import { Segment, Menu, Icon } from 'semantic-ui-react';

// eslint-disable-next-line
export const StyledNavBar = styled(({ toggleWidth, ...props }) => <Menu {...props} />)`
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
export const StyledMenuItem = styled(({ toggleWidth, ...props }) => <Menu.Item {...props} />)`
  padding: 0 0.5em !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  @media only screen and (max-width: 767px) {
    height: 3vh;
    min-height: 60px;
  }
`;

export const BarSegment = styled(Segment)`
  height: 4vh;
  max-height: 48px;
  padding-top: 0 !important;
  padding-bottom: 1.35em !important;
  display: flex;
  justify-content: center;
  align-items: center;
`;
// eslint-disable-next-line
export const NavBarItemMenu = styled(({ toggleWidth, expanded, length, ...props }) => (
  <Menu {...props} />
))`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  height: 100%;
  @media only screen and (max-width: ${({ toggleWidth }) => toggleWidth - 1}px) {
    transition: all 400ms;
    display: block;
    flex-direction: column;
    justify-content: space-around;
    overflow: hidden;
    width: 100%;
    min-height: ${({ length, expanded }) => (expanded ? length * 60 : 0)}px !important;
    height: ${({ length, expanded }) => (expanded ? length * 3 : 0)}vh;
    border: none !important;
  }
`;

export const Title = styled.h1`
  text-align: left;
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding: 0.2em;
`;

export const NavHeader = styled.span`
  color: #222;
  font-size: 1.25em;
  padding-bottom: 0.4em;
`;

export const StyledIcon = styled(Icon)`
  color: #222;
  margin: 0;
`;
