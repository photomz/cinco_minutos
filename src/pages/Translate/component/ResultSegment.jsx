/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Grid, Header } from 'semantic-ui-react';

const ResultSegment = ({ action, content, ...props }) => (
  <Segment style={{ maxWidth: '90vw' }} {...props}>
    <Grid celled="internally" columns={2}>
      <Grid.Row textAlign="center">
        <Grid.Column>
          <Header as="b" content="Translation" />
        </Grid.Column>
        <Grid.Column>
          <Header as="b" content="Details" />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <div>
            {(action === 'loading' && ((content.val && content.val + '...') || 'Loading...')) ||
              (action === 'invalid' && "Invalid phrase '" + content.origPhrase + "'!") ||
              content.val}
          </div>
        </Grid.Column>
        <Grid.Column>
          <div style={content.origLang ? {} : { display: 'hidden' }}>
            Translated from: <b>{(content.origLang || '').toUpperCase()}</b>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Segment>
);

ResultSegment.propTypes = {
  children: PropTypes.node,
  action: PropTypes.string,
  content: PropTypes.object,
};
export default ResultSegment;
