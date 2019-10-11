import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { NavHeader } from './styled';

const toTitleCase = str => str.charAt(0).toUpperCase() + str.slice(1);

const NavItem = ({ children, icon, active, ...props }) => (
  <Menu.Item name={children} active={active} as="div" {...props}>
    <NavHeader>{toTitleCase(children)}</NavHeader>
    <Icon name={icon} size="large" style={{ margin: 0 }} />
  </Menu.Item>
);

NavItem.propTypes = {
  children: PropTypes.string,
  icon: PropTypes.string,
  setIsExpanded: PropTypes.func,
  active: PropTypes.any,
  under: PropTypes.bool,
};

export default NavItem;
