/* eslint-disable no-console */
import React from 'react';
import { Menu, Icon, Responsive } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const NavBar = ({ content, onClick, active }) => {
  const [title, ...navItems] = content;
  return (
    <Responsive as={Menu} pointing minWidth={576}>
      <Menu.Header style={{ margin: '0 auto' }} as="h1">
        <Responsive as={Icon} minWidth={768} name={title.icon} />
        {title.name}
      </Menu.Header>
      <Menu.Menu position="right">
        {navItems.map(elem => (
          <Menu.Item
            key={elem.name}
            name={elem.name}
            active={active === elem.name}
            onClick={() => onClick(elem.name)}
            style={{ paddingRight: '0.7em', paddingLeft: '0.7em' }}
          >
            <Responsive as={Icon} minWidth={768} name={elem.icon} />
            {elem.name.charAt(0).toUpperCase() + elem.name.slice(1)}
          </Menu.Item>
        ))}
      </Menu.Menu>
    </Responsive>
  );
};

NavBar.propTypes = {
  onClick: PropTypes.func,
  active: PropTypes.string,
  content: PropTypes.array.isRequired,
};

export default NavBar;
