import React from 'react';
import PropTypes from 'prop-types';
import { Segment, Label, Icon, Image, Popup } from 'semantic-ui-react';

import spanishdictImage from '../../../assets/images/spanishdict.png';
import wordreferenceImage from '../../../assets/images/wordreference.png';

const menuDefault = {
  as: 'img',
  style: { marginRight: 10, display: 'inline', height: '1.5em', width: '1.5em' },
};

const OptionLabels = ({ action, verb, buttonsDisabled, setAction, ...props }) => (
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
    <Popup
      disabled={!buttonsDisabled}
      content="Search for a valid verb to open it in SpanishDict."
      trigger={
        <Label
          onClick={() => {
            if (!buttonsDisabled) window.open('https://www.spanishdict.com/conjugate/' + verb);
          }}
          as="a"
        >
          <Image {...menuDefault} src={spanishdictImage} className="menuImage" alt="" />
          SpanishDict
        </Label>
      }
    />
    <Popup
      disabled={!buttonsDisabled}
      content="Search for a valid verb to open it in WordReference."
      trigger={
        <Label
          onClick={() => {
            if (!buttonsDisabled)
              window.open('https://www.wordreference.com/es/en/translation.asp?spen=' + verb);
          }}
          as="a"
          disabled={buttonsDisabled}
        >
          <Image {...menuDefault} src={wordreferenceImage} className="menuImage" alt="" />
          WordReference
        </Label>
      }
    />
  </Segment>
);

OptionLabels.propTypes = {
  action: PropTypes.string,
  verb: PropTypes.string,
  buttonsDisabled: PropTypes.bool,
  setAction: PropTypes.func,
};

export default OptionLabels;
