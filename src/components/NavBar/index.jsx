/* eslint-disable no-console */
import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Icon, Responsive } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import nanoid from 'nanoid/non-secure';

import { StyledNavBar, BarSegment, Title, NavBarItemMenu, StyledIcon } from './styled';
import NavItem from './NavItem';
import data from './data';
const { title, github, navLinks } = data;

const NavBar = withRouter(({ location: { pathname } }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <StyledNavBar toggleWidth={768}>
      <Menu.Header as={Title}>
        <div>
          <Icon name={title.icon} />
          {title.name}
        </div>
        <Responsive maxWidth={767}>
          <BarSegment onClick={() => setIsExpanded(prev => !prev)}>
            <StyledIcon name="bars" style={{ margin: 0 }} />
          </BarSegment>
        </Responsive>
      </Menu.Header>
      <NavBarItemMenu length={[github, ...navLinks].length} expanded={isExpanded} toggleWidth={768}>
        {navLinks.map(({ name, route, icon }) => (
          <Link to={route} key={nanoid()} aria-label={name}>
            <NavItem onClick={() => setIsExpanded(false)} active={pathname === route} icon={icon}>
              {name}
            </NavItem>
          </Link>
        ))}
        <Link to="#">
          <NavItem
            active={location.pathname === github.route}
            icon={github.icon}
            onClick={() => {
              window.location = github.route;
            }}
          >
            {github.name}
          </NavItem>
        </Link>
      </NavBarItemMenu>
    </StyledNavBar>
  );
});

NavBar.propTypes = {
  location: PropTypes.object,
};

export default NavBar;
