/* eslint-disable no-console */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Segment, Popup, Header, Divider } from 'semantic-ui-react';
import sendMessage, { serviceWorker, checkOffline } from '../updateSW.js';
import info from '../../globals.json';

let updateOffline = setTimeout(() => null, 0);

let Settings = props => {
  const serviceWorkerExists = !!serviceWorker();
  let [toggleOfflineAllowed, setToggleOfflineAllowed] = useState(serviceWorkerExists);
  let [offlineAvailable, setOfflineAvailable] = useState(serviceWorkerExists);
  let [isLoading, setIsLoading] = useState(false);
  let [errorContent, setErrorContent] = useState(
    "You need a modern browser that supports Service Workers to use offline functionality. If you're using a modern browser, try refreshing the page.",
  );
  useEffect(() => {
    if (serviceWorkerExists) {
      sendMessage({ type: 'offline' }).then(val => {
        setOfflineAvailable(val);
      });
      checkOffline().then(offline => {
        if (offline) whenOffline();
      });
    }
  }, []);
  const whenOffline = () => {
    console.log('Offline!');
    setErrorContent(
      'You are currently offline and therefore cannot turn off offline compatibility.',
    );
    setToggleOfflineAllowed(false);
  };
  let offlineRef = useRef(null);
  const toggleOffline = () => {
    blur(offlineRef);
    if (isLoading) {
      clearTimeout(updateOffline);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    updateOffline = setTimeout(
      () =>
        sendMessage({ type: 'offline', value: !offlineAvailable }).then(() => {
          setOfflineAvailable(!offlineAvailable);
          setIsLoading(false);
        }),
      2000,
    );
  };
  const blur = ref => {
    if (ref) {
      ref.current.ref.current.blur();
    }
  };
  return (
    <div id="settings">
      <Header size="huge" textAlign="center" style={{ marginTop: '15vh' }}>
        Settings
      </Header>
      <Divider horizontal clearing />
      <Segment padded raised textAlign="center" style={{ maxWidth: '80vw', margin: '0 auto' }}>
        <Popup
          disabled={toggleOfflineAllowed}
          content={errorContent}
          trigger={
            <Button
              as="div"
              positive={!offlineAvailable && serviceWorkerExists}
              negative={offlineAvailable && isLoading}
              onClick={(!toggleOfflineAllowed && (() => blur(offlineRef))) || toggleOffline}
              animated={isLoading}
              ref={offlineRef}
            >
              <Button.Content visible>
                {(offlineAvailable ? 'Disabl' : 'Enabl') +
                  (isLoading ? 'ing offline access...' : 'e offline access')}
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
