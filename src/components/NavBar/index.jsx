/* eslint-disable no-console */
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import nanoid from 'nanoid/non-secure';

import NavItem from './NavItem';
import { StyledNavBar, BarSegment } from './styled';

const NavBar = ({ content, onClick, active, expanded, width, toggleWidth }) => {
  const [title, ...navItems] = content;
  return (
    <StyledNavBar
      as={Menu}
      animation="overlay"
      icon="labeled"
      visible
      direction="top"
      vertical={width < toggleWidth}
      expanded={expanded}
      ceilingHeight={width >= toggleWidth && width}
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

        <BarSegment as={Segment} maxWidth={toggleWidth - 1} onClick={onClick}>
          <Icon name="bars" />
        </BarSegment>
      </Menu.Header>
      <Menu.Menu position="right">
        {navItems.map(elem =>
          elem.route ? (
            <Link to={elem.route} key={nanoid()} aria-label={elem.name}>
              <NavItem onClick={onClick} active={active} elem={elem} toggleWidth={toggleWidth} />
            </Link>
          ) : (
            <NavItem
              onClick={onClick}
              active={active}
              elem={elem}
              key={nanoid()}
              under={!elem.name}
              toggleWidth={toggleWidth}
            />
          ),
        )}
      </Menu.Menu>
    </StyledNavBar>
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
