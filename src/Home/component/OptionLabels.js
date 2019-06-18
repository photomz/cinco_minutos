import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Label, Icon, Image } from 'semantic-ui-react';

import spanishdictImage from '../../static/spanishdict.png';
import wordreferenceImage from '../../static/wordreference.png';

const menuDefault = {
  as: 'img',
  style: { marginRight: 10, display: 'inline', height: '1.5em', width: '1.5em' },
};

const OptionLabels = ({ action, spanishdictLink, wordreferenceLink, setAction, ...props }) => (
  <Segment textAlign="left" {...props}>
    <Label
      onClick={() => setAction(action === 'verbCheck' ? 'idle' : 'verbCheck')}
      color={action === 'verbCheck' ? 'blue' : null}
      as="a"
    >
      <Icon name="pencil" size="large" />
      Verb Check
    </Label>
    <Label
      onClick={() => setAction(action === 'addingCollection' ? 'idle' : 'addingCollection')}
      color={action === 'addingCollection' ? 'blue' : null}
      as="a"
    >
      <Icon name="list" size="large" />
      Add To Collection
    </Label>
    <Label onClick={() => window.open(spanishdictLink)} as="a">
      <Image {...menuDefault} src={spanishdictImage} id="menuImage" />
      SpanishDict
    </Label>
    <Label onClick={() => window.open(wordreferenceLink)} as="a">
      <Image {...menuDefault} src={wordreferenceImage} id="menuImage" />
      WordReference
    </Label>
  </Segment>
);

OptionLabels.propTypes = {
  action: PropTypes.string,
  spanishdictLink: PropTypes.string,
  wordreferenceLink: PropTypes.string,
  setAction: PropTypes.func,
};

export default OptionLabels;
