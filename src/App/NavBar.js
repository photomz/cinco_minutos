/* eslint-disable no-console */
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Responsive, Sidebar, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const NavItem = ({ elem, onClick, active, under, expanded }) => (
  <Responsive
    as={Menu.Item}
    minWidth={under || expanded ? null : 768}
    maxWidth={under ? 767 : null}
    key={elem.name}
    name={elem.name}
    active={active === elem.name && !!elem.name}
    onClick={() => onClick(elem.name)}
    style={{ paddingRight: '0.7em', paddingLeft: '0.7em' }}
  >
    <Icon name={elem.icon} />
    {elem.name.charAt(0).toUpperCase() + elem.name.slice(1)}
  </Responsive>
);

NavItem.propTypes = {
  elem: PropTypes.object,
  onClick: PropTypes.func,
  active: PropTypes.any,
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
      vertical={expanded && width <= 768}
    >
      <Menu.Header as="h1" style={{ textAlign: 'left' }}>
        <Icon name={title.icon} />
        {title.name}
        <Responsive
          as={Segment}
          maxWidth={767}
          style={{
            position: 'absolute',
            top: '-0.6em',
            right: '0.5em',
            height: 'calc(52px - 1em)',
            width: '4em',
            paddingTop: '0.1em',
            paddingRight: '0.6em',
            textAlign: 'center',
          }}
          onClick={onClick}
        >
          <Icon name={'bars'} />
        </Responsive>
      </Menu.Header>
      <Menu.Menu position="right">
        {navItems.map(elem =>
          elem.route ? (
            <Link to={elem.route} key={elem.name}>
              <NavItem onClick={onClick} active={active} elem={elem} expanded={expanded} />
            </Link>
          ) : (
            <NavItem
              onClick={onClick}
              active={active}
              elem={elem}
              key={elem.name}
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
};

export default NavBar;
