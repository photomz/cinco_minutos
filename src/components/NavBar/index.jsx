/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Icon, Responsive } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import nanoid from 'nanoid/non-secure';

import ROUTES from '../../global/routes';
import { StyledNavBar, StyledNavItem, BarSegment, HeaderOne, NavBarItemMenu } from './styled';

const navContent = [
  { name: 'ℭ𝔦𝔫𝔠𝔬𝔐𝔦𝔫𝔲𝔱𝔬𝔰', icon: 'chess' },
  { name: 'github', icon: 'github', route: ROUTES.GitHub },
  { name: 'home', icon: 'home', route: ROUTES.Home },
  { name: 'translate', icon: 'language', route: ROUTES.Translate },
  { name: 'browse', icon: 'book', route: ROUTES.Browse },
  { name: 'collections', icon: 'archive', route: ROUTES.Collections },
  { name: 'settings', icon: 'settings', route: ROUTES.Settings },
  { name: 'about', icon: 'code', route: ROUTES.About },
];

const NavBar = withRouter(({ location: { pathname } }) => {
  const [title, github, ...navItems] = navContent;
  const [isExpanded, setIsExpanded] = useState(false);
  console.log(ROUTES);
  const onNavClick = () => setIsExpanded(false);
  const onToggle = () => setIsExpanded(prev => !prev);
  return (
    <StyledNavBar toggleWidth={768}>
      <Menu.Header as={HeaderOne}>
        <div>
          <Icon name={title.icon} />
          {title.name}
        </div>
        <Responsive maxWidth={767}>
          <BarSegment onClick={onToggle}>
            <Icon name="bars" style={{ margin: 0 }} />
          </BarSegment>
        </Responsive>
      </Menu.Header>
      <NavBarItemMenu length={[github, ...navItems].length} expanded={isExpanded} toggleWidth={768}>
        {navItems.map(({ name, route, icon }) => (
          <Link to={route} key={nanoid()} aria-label={name}>
            <StyledNavItem
              toggleWidth={768}
              onClick={onNavClick}
              name={name}
              active={pathname === route}
              icon={icon}
            />
          </Link>
        ))}
        <StyledNavItem
          toggleWidth={768}
          active={location.pathname === github.route}
          name={github.name}
          icon={github.icon}
          onClick={() => window.open(github.route)}
        />
      </NavBarItemMenu>
    </StyledNavBar>
  );
});

NavBar.propTypes = {
  location: PropTypes.object,
};

export default NavBar;
