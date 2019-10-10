/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon, Responsive } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import nanoid from 'nanoid/non-secure';

import { StyledNavBar, StyledNavItem, BarSegment, NavBarItemMenu } from './styled';

const NavBar = ({ content, onNavClick, active, expanded, onToggle }) => {
  const [title, ...navItems] = content;
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
      <NavBarItemMenu expanded={expanded} toggleWidth={768}>
        {navItems.map(elem =>
          elem.route ? (
            <Link to={elem.route} key={nanoid()} aria-label={elem.name}>
              <StyledNavItem toggleWidth={768} onClick={onNavClick} active={active} elem={elem} />
            </Link>
          ) : (
            <StyledNavItem
              toggleWidth={768}
              onClick={onNavClick}
              active={active}
              elem={elem}
              key={nanoid()}
            />
          ),
        )}
      </NavBarItemMenu>
    </StyledNavBar>
  );
};

NavBar.propTypes = {
  onNavClick: PropTypes.func,
  active: PropTypes.any,
  content: PropTypes.array.isRequired,
  width: PropTypes.number,
  expanded: PropTypes.bool,
  toggleWidth: PropTypes.number,
};

export default NavBar;
