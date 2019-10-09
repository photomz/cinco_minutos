import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const NavItem = ({ elem, onClick, active }) => (
  <Menu.Item
    name={elem.name}
    active={active === elem.name && !!elem.name}
    onClick={() => onClick(elem.name)}
    as="div"
    style={{
      padding: '0 0.5em',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    }}
  >
    <span style={{ fontSize: '1.2em', paddingBottom: '0.4em' }}>
      {elem.name.charAt(0).toUpperCase() + elem.name.slice(1)}
    </span>
    <Icon name={elem.icon} size="large" style={{ margin: 0 }} />
  </Menu.Item>
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
