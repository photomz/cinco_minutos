/* eslint-disable no-console */
import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Icon, Responsive } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import nanoid from 'nanoid/non-secure';

import { StyledNavBar, StyledNavItem, BarSegment, Title, NavBarItemMenu } from './styled';
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
            <Icon name="bars" style={{ margin: 0 }} />
          </BarSegment>
        </Responsive>
      </Menu.Header>
      <NavBarItemMenu length={[github, ...navLinks].length} expanded={isExpanded} toggleWidth={768}>
        {navLinks.map(({ name, route, icon }) => (
          <Link to={route} key={nanoid()} aria-label={name}>
            <StyledNavItem
              onClick={() => setIsExpanded(false)}
              active={pathname === route}
              icon={icon}
            >
              {name}
            </StyledNavItem>
          </Link>
        ))}
        <Link to="#">
          <StyledNavItem
            active={location.pathname === github.route}
            icon={github.icon}
            onClick={() => window.open(github.route)}
          >
            {github.name}
          </StyledNavItem>
        </Link>
      </NavBarItemMenu>
    </StyledNavBar>
  );
});

NavBar.propTypes = {
  location: PropTypes.object,
};

export default NavBar;
