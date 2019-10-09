/* eslint-disable no-console */
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Responsive } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import nanoid from 'nanoid/non-secure';

import NavItem from './NavItem';
import { StyledNavBar, BarSegment, NavBarItemMenu } from './styled';

const NavBar = ({ content, onClick, active, expanded }) => {
  const [title, ...navItems] = content;
  return (
    <StyledNavBar>
      <Menu.Header
        as="h1"
        style={{
          textAlign: 'left',
          margin: 0,
        }}
      >
        <Icon name={title.icon} />
        {title.name}
      </Menu.Header>
      <Responsive maxWidth={767}>
        <BarSegment onClick={onClick}>
          <Icon name="bars" style={{ margin: 0 }} />
        </BarSegment>
      </Responsive>
      <NavBarItemMenu style={{ height: '100%' }} toggleWidth={768} expanded={expanded}>
        {navItems.map(elem =>
          elem.route ? (
            <Link to={elem.route} key={nanoid()} aria-label={elem.name}>
              <NavItem onClick={onClick} active={active} elem={elem} />
            </Link>
          ) : (
            <NavItem onClick={onClick} active={active} elem={elem} key={nanoid()} />
          ),
        )}
      </NavBarItemMenu>
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
