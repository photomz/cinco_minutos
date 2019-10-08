import styled from 'styled-components';
import { Sidebar, Responsive } from 'semantic-ui-react';

const StyledNavBar = styled(Sidebar)`
  overflow: hidden !important;
  height: auto !important;
  transition: height 400ms ease-in-out;
  & + * {
    margin-top: 75px;
  }
  ${({ vertical, expanded }) => vertical && `height: ${expanded ? 56 : 54}px !important;`}
  ${({ ceilingHeight }) => ceilingHeight && `maxHeight: 73px;`}
`;

const BarSegment = styled(Responsive)`
  position: absolute;
  top: -0.6em;
  right: 0.5em;
  height: calc(52px - 1em);
  width: 4em;
  padding-top: 0.1em;
  padding-right: 0.6em;
  margin-top: 14px;
  text-align: center;
`;

export { StyledNavBar, BarSegment };
