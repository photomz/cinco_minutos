/* eslint-disable no-console */
import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const NavBar = ({ items, onClick, active, icons, title }) => {
  if (items.length !== icons.length) {
    console.log(items, icons);
    return <div>Unequal lengths of items and icons array passed into NavBar component.</div>;
  }
  return (
    <div>
      <Menu pointing icon="labeled">
        <Menu.Header
          textAlign="center"
          style={{ 'font-size': '3.5rem', 'letter-spacing': '0.5rem', 'padding-left': '10rem' }}
          as="h1"
        >
          {title}
        </Menu.Header>
        <Menu.Menu position="right">
          {items.map((elem, index) => (
            <Menu.Item key={index} name={elem} active={active === elem} onClick={onClick}>
              <Icon name={icons[index]} />
              {elem.charAt(0).toUpperCase() + elem.slice(1) /* Capitalizes button*/}
            </Menu.Item>
          ))}
        </Menu.Menu>
      </Menu>
    </div>
  );
};

NavBar.propTypes = {
  items: PropTypes.array.isRequired,
  icons: PropTypes.array.isRequired,
  onClick: PropTypes.func,
  active: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default NavBar;
