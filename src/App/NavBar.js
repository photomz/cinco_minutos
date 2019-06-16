/* eslint-disable no-console */
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Responsive } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const NavItem = ({ elem, onClick, active }) => (
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
);

NavItem.propTypes = {
  elem: PropTypes.object,
  onClick: PropTypes.func,
  active: PropTypes.string,
};

const NavBar = ({ content, onClick, active }) => {
  const [title, ...navItems] = content;
  return (
    <Responsive as={Menu} pointing minWidth={576}>
      <Menu.Header style={{ margin: '0 auto' }} as="h1">
        <Responsive as={Icon} minWidth={768} name={title.icon} />
        {title.name}
      </Menu.Header>
      <Menu.Menu position="right">
        {navItems.map(elem =>
          elem.route ? (
            <Link to={elem.route} key={elem.name}>
              <NavItem onClick={onClick} active={active} elem={elem} />
            </Link>
          ) : (
            <NavItem onClick={onClick} active={active} elem={elem} key={elem.name} />
          ),
        )}
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
