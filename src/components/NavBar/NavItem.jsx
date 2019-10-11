import React from 'react';
import PropTypes from 'prop-types';
import { NavHeader, StyledMenuItem, StyledIcon } from './styled';

const toTitleCase = str => str.charAt(0).toUpperCase() + str.slice(1);

const NavItem = ({ children, icon, active, ...props }) => (
  <StyledMenuItem name={children} active={active} as="div" {...props}>
    <NavHeader>{toTitleCase(children)}</NavHeader>
    <StyledIcon name={icon} size="large" style={{ margin: 0 }} />
  </StyledMenuItem>
);

NavItem.propTypes = {
  children: PropTypes.string,
  icon: PropTypes.string,
  setIsExpanded: PropTypes.func,
  active: PropTypes.any,
  under: PropTypes.bool,
};

export default NavItem;
