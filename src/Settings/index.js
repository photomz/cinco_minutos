/* eslint-disable no-console */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Segment, Popup, Header, Divider } from 'semantic-ui-react';
import sendMessage, { serviceWorker } from './logic/updateSW.js';

let updateOffline = setTimeout(() => null, 0);

let Settings = props => {
  const serviceWorkerExists = !!serviceWorker();
  let [offline, setOffline] = useState(serviceWorkerExists);
  let [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (serviceWorkerExists) {
      sendMessage('offline').then(val => {
        console.log(val);
        setOffline(val);
      });
    }
  }, []);
  let offlineRef = useRef(null);
  const toggleOffline = () => {
    offlineRef.current.ref.current.blur();
    if (isLoading) {
      clearTimeout(updateOffline);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    updateOffline = setTimeout(
      () =>
        sendMessage('offline', !offline).then(() => {
          setOffline(!offline);
          setIsLoading(false);
        }),
      2000,
    );
  };
  const NOP = () => {};
  return (
    <div id="settings">
      <Header size="huge" textAlign="center" style={{ marginTop: '15vh' }}>
        Settings
      </Header>
      <Divider horizontal clearing />
      <Segment padded raised textAlign="center" style={{ maxWidth: '80vw', margin: '0 auto' }}>
        <Popup
          disabled={serviceWorkerExists}
          content="You need a modern browser that supports Service Workers to use offline functionality. If you're using a modern browser, try refreshing the page."
          trigger={
            <Button
              as="div"
              positive={!offline && serviceWorkerExists}
              negative={offline && isLoading}
              onClick={(!serviceWorkerExists && NOP) || toggleOffline}
              animated={isLoading}
              ref={offlineRef}
            >
              <Button.Content visible>
                {isLoading
                  ? (offline ? 'Disabl' : 'Enabl') + 'ing offline access...'
                  : (offline ? 'Disable' : 'Enable') + ' offline access'}
              </Button.Content>
              <Button.Content hidden>{isLoading ? 'Cancel' : ''}</Button.Content>
            </Button>
          }
        />
      </Segment>
    </div>
  );
};

Settings.propTypes = {
  children: PropTypes.node,
};

export default Settings;
