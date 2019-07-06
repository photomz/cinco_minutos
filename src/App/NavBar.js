/* eslint-disable no-console */
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Responsive, Sidebar, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1';

import './NavBar.css';

const NavItem = ({ elem, onClick, active, under, expanded }) => (
  <Responsive minWidth={under || expanded ? null : 768} maxWidth={under ? 767 : null}>
    <Menu.Item
      key={uuidv1()}
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
};

const NavBar = ({ content, onClick, active, expanded, width }) => {
  const [title, ...navItems] = content;
  return (
    <Sidebar
      id="navbar"
      as={Menu}
      animation="overlay"
      icon="labeled"
      visible={true}
      direction="top"
      vertical={!!(expanded && width <= 768 && width)}
    >
      <Menu.Header
        as="h1"
        style={{
          textAlign: 'left',
          margin: (width ? (width > 768 ? 'auto' : '0.3em') : 'auto') + ' 0.5em',
        }}
      >
        <Responsive as="div" minWidth={310}>
          <Icon name={title.icon} />
          {title.name}
        </Responsive>

        <Responsive as={Segment} maxWidth={767} id="barSegment" onClick={onClick}>
          <Icon name="bars" />
        </Responsive>
      </Menu.Header>
      <Menu.Menu position="right">
        {navItems.map(elem =>
          elem.route ? (
            <Link to={elem.route} key={uuidv1()} aria-label={elem.name}>
              <NavItem onClick={onClick} active={active} elem={elem} expanded={expanded} />
            </Link>
          ) : (
            <NavItem
              onClick={onClick}
              active={active}
              elem={elem}
              key={uuidv1()}
              under={!elem.name}
              expanded={expanded}
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
};

export default NavBar;
