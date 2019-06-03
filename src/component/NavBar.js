/* eslint-disable no-console */
import React from 'react';
import { Menu } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const NavBar = ({ items, onClick, active }) => {
  console.log(items);
  return (
    <div>
      <Menu pointing>
        <Menu.Menu position="right">
          {items.map((elem, index) => (
            <Menu.Item key={index} name={elem} active={active === elem} onClick={onClick} />
          ))}
        </Menu.Menu>
      </Menu>
    </div>
  );
};

NavBar.propTypes = {
  items: PropTypes.array,
  onClick: PropTypes.func,
  active: PropTypes.string,
};

export default NavBar;
