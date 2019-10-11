import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const NavItem = ({ name, icon, onClick, active, ...props }) => (
  <Menu.Item name={name} active={active} onClick={() => onClick(name)} as="div" {...props}>
    <span style={{ fontSize: '1.25em', paddingBottom: '0.4em' }}>
      {name.charAt(0).toUpperCase() + name.slice(1)}
    </span>
    <Icon name={icon} size="large" style={{ margin: 0 }} />
  </Menu.Item>
);

NavItem.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  active: PropTypes.any,
  under: PropTypes.bool,
};

export default NavItem;
