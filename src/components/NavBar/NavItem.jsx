import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const NavItem = ({ elem, onClick, active, ...props }) => (
  <Menu.Item
    name={elem.name}
    active={active === elem.name && !!elem.name}
    onClick={() => onClick(elem.name)}
    as="div"
    {...props}
  >
    <span style={{ fontSize: '1.25em', paddingBottom: '0.4em' }}>
      {elem.name.charAt(0).toUpperCase() + elem.name.slice(1)}
    </span>
    <Icon name={elem.icon} size="large" style={{ margin: 0 }} />
  </Menu.Item>
);

NavItem.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  active: PropTypes.any,
  under: PropTypes.bool,
  expanded: PropTypes.bool,
  toggleWidth: PropTypes.number,
};

export default NavItem;
