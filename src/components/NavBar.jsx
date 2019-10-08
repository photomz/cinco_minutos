/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Responsive, Sidebar, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import shortid from 'shortid';

import './NavBar.css';

const NavItem = ({ elem, onClick, active, under, toggleWidth }) => (
  <Responsive maxWidth={under ? toggleWidth - 1 : null}>
    <Menu.Item
      key={shortid.generate()()}
      name={elem.name}
      active={active === elem.name && !!elem.name}
      onClick={() => onClick(elem.name)}
      as="div"
      style={{ paddingRight: '0.7em', paddingLeft: '0.7em' }}
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
const NavBar = ({ content, onClick, active, expanded, width, toggleWidth }) => {
  const [title, ...navItems] = content;
  return (
    <Sidebar
      id="navbar"
      as={Menu}
      animation="overlay"
      icon="labeled"
      visible
      direction="top"
      vertical={width < toggleWidth}
      className={expanded ? 'expanded' : ''}
      style={width >= toggleWidth && width ? { maxHeight: '73px' } : {}}
    >
      <Menu.Header
        as="h1"
        style={{
          textAlign: 'left',
          margin: (width ? (width >= toggleWidth ? 'auto' : '0.3em') : 'auto') + ' 0.5em',
        }}
      >
        <Icon name={title.icon} />
        {title.name}

        <Responsive as={Segment} maxWidth={toggleWidth - 1} id="barSegment" onClick={onClick}>
          <Icon name="bars" />
        </Responsive>
      </Menu.Header>
      <Menu.Menu position="right">
        {navItems.map(elem =>
          elem.route ? (
            <Link to={elem.route} key={shortid.generate()()} aria-label={elem.name}>
              <NavItem onClick={onClick} active={active} elem={elem} toggleWidth={toggleWidth} />
            </Link>
          ) : (
            <NavItem
              onClick={onClick}
              active={active}
              elem={elem}
              key={shortid.generate()()}
              under={!elem.name}
              toggleWidth={toggleWidth}
            />
          ),
        )}
      </Menu.Menu>
    </Sidebar>
  );
};

NavBar.propTypes = {
  onClick: PropTypes.func,
  active: PropTypes.any,
  content: PropTypes.array.isRequired,
  width: PropTypes.number,
  expanded: PropTypes.bool,
  toggleWidth: PropTypes.number,
};

export default NavBar;
