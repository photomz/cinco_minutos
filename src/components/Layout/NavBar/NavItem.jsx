import React from 'react';
import PropTypes from 'prop-types';
import { NavHeader, StyledMenuItem, StyledIcon } from './styled';

const toTitleCase = str => str.charAt(0).toUpperCase() + str.slice(1);

const NavItem = ({ children, icon, active }) => (
  <StyledMenuItem name={children} active={active} as="div">
    <NavHeader>{toTitleCase(children)}</NavHeader>
    <StyledIcon name={icon} size="large" style={{ margin: 0 }} />
  </StyledMenuItem>
);

NavItem.defaultProps = {
  children: 'Landing',
  icon: 'home',
  active: true,
};

NavItem.propTypes = {
  children: PropTypes.string,
  icon: PropTypes.string,
  active: PropTypes.any,
};

export default NavItem;
