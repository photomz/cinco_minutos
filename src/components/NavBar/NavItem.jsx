import React from 'react';
import { Responsive, Menu, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const NavItem = ({ elem, onClick, active, under, toggleWidth }) => (
  <Responsive maxWidth={under ? toggleWidth - 1 : null}>
    <Menu.Item
      name={elem.name}
      active={active === elem.name && !!elem.name}
      onClick={() => onClick(elem.name)}
      as="div"
      style={{ padding: '0.7em 0' }}
    >
      <Icon name={elem.icon} />
      {elem.name.charAt(0).toUpperCase() + elem.name.slice(1)}
    </Menu.Item>
  </Responsive>
);

NavItem.propTypes = {
  elem: PropTypes.object,
  onClick: PropTypes.func,
  active: PropTypes.any,
  under: PropTypes.bool,
  expanded: PropTypes.bool,
  toggleWidth: PropTypes.number,
};

export default NavItem;
