import React from 'react';
import PropTypes from 'prop-types';
import { Label, Image, Popup } from 'semantic-ui-react';
import styled from 'styled-components';

const StyledImage = styled(Image)`
  margin-right: 10px;
  display: inline;
`;

const StyledLabel = styled(Label)`
  /* Must force greater css specificity with !important */
  & > ${StyledImage}:first-child:last-child {
    width: 1.286rem !important;
    height: auto !important;
  }
`;

// TODO: Remove className, only exists because of styled-components and semantic-ui conflicts
const ExternalRedirect = ({ verb, disabled, prefix, postfix, name, src }) => (
  <Popup
    disabled={!disabled}
    content={`Search for a valid verb to open it in ${name}.`}
    trigger={
      <StyledLabel
        onClick={() => !disabled && window.open(prefix + verb + postfix)}
        as="a"
        className="ui label"
      >
        <StyledImage as="img" src={src} alt="" />
        SpanishDict
      </StyledLabel>
    }
  />
);

ExternalRedirect.propTypes = {
  verb: PropTypes.string,
  disabled: PropTypes.bool,
  prefix: PropTypes.string,
  postfix: PropTypes.string,
  name: PropTypes.string,
  src: PropTypes.string,
};

export default ExternalRedirect;
