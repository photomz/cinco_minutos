import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Header, Loader, Label } from 'semantic-ui-react';

const ResultSegment = ({ verb, def, presentPart, pastPart, isSearched, unsearchedVal, action }) => (
  <Segment padded>
    {isSearched ? (
      <div>
        <Header as="h1" content={verb} textAlign="center" />
        <Header as="h3" content={def} textAlign="center" />
        <Label content={`Present Participle - ${presentPart}`} />
        <Label content={`Past Participle - ${pastPart}`} style={{ marginLeft: 10 }} />
      </div>
    ) : action === 'loading' && window.location.pathname !== '/' ? (
      <Loader active content="Loading" inline="centered" />
    ) : (
      <Header as="h2" content={unsearchedVal} textAlign="center" />
    )}
  </Segment>
);

ResultSegment.propTypes = {
  verb: PropTypes.string,
  def: PropTypes.string,
  presentPart: PropTypes.string,
  pastPart: PropTypes.string,
  isSearched: PropTypes.bool.isRequired,
  unsearchedVal: PropTypes.string,
  action: PropTypes.string,
};

export default ResultSegment;
