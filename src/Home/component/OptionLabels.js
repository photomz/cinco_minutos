import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Label, Icon, Image } from 'semantic-ui-react';

import spanishdictImage from '../../static/spanishdict.png';
import wordreferenceImage from '../../static/wordreference.png';

const menuDefault = {
  as: 'img',
  style: { marginRight: 10, display: 'inline', height: '1.5em', width: '1.5em' },
};

const OptionLabels = ({
  action,
  spanishdictLink,
  wordreferenceLink,
  buttonsDisabled,
  setAction,
  ...props
}) => (
  <Segment textAlign="center" {...props}>
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
    <Label
      onClick={() => {
        if (!buttonsDisabled) window.open(spanishdictLink);
      }}
      as="a"
    >
      <Image {...menuDefault} src={spanishdictImage} className="menuImage" alt="" />
      SpanishDict
    </Label>
    <Label
      onClick={() => {
        if (!buttonsDisabled) window.open(wordreferenceLink);
      }}
      as="a"
      disabled={buttonsDisabled}
    >
      <Image {...menuDefault} src={wordreferenceImage} className="menuImage" alt="" />
      WordReference
    </Label>
  </Segment>
);

OptionLabels.propTypes = {
  action: PropTypes.string,
  spanishdictLink: PropTypes.string,
  wordreferenceLink: PropTypes.string,
  buttonsDisabled: PropTypes.bool,
  setAction: PropTypes.func,
};

export default OptionLabels;
