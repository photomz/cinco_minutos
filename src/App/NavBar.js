/* eslint-disable no-console */
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Responsive, Sidebar, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1';

import './NavBar.css';

const NavItem = ({ elem, onClick, active, under, expanded, toggleWidth }) => (
  <Responsive
    minWidth={under || expanded ? null : toggleWidth}
    maxWidth={under ? toggleWidth - 1 : null}
  >
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
      vertical={!!(expanded && width <= toggleWidth && width)}
      style={width >= toggleWidth && width ? { maxHeight: '73px' } : {}}
      ref={el => {
        // We need to do this because ReactJS removed support for important styling in v15.
        if (el) {
          if (el.ref.current) {
            if (width >= toggleWidth && width)
              el.ref.current.style.setProperty('height', 'auto', 'important');
            else el.ref.current.style.removeProperty('height');
          }
        }
      }}
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
            <Link to={elem.route} key={uuidv1()} aria-label={elem.name}>
              <NavItem
                onClick={onClick}
                active={active}
                elem={elem}
                expanded={expanded}
                toggleWidth={toggleWidth}
              />
            </Link>
          ) : (
            <NavItem
              onClick={onClick}
              active={active}
              elem={elem}
              key={uuidv1()}
              under={!elem.name}
              expanded={expanded}
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
