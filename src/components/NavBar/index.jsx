/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Menu, Icon, Responsive } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import nanoid from 'nanoid/non-secure';

import ROUTES from '../../global/routes';
import { StyledNavBar, StyledNavItem, BarSegment, NavBarItemMenu } from './styled';

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
      <Menu.Header
        as="h1"
        style={{
          textAlign: 'left',
          margin: 0,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          padding: '0.2em',
        }}
      >
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
        {navItems.map(elem => (
          <Link to={elem.route} key={nanoid()} aria-label={elem.name}>
            <StyledNavItem
              toggleWidth={768}
              onClick={onNavClick}
              active={pathname === elem.route}
              elem={elem}
            />
          </Link>
        ))}
        <StyledNavItem
          toggleWidth={768}
          active={location.pathname === github.route}
          elem={github}
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
