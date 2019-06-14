/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Header, Button, Grid, Segment, Image, Label, Icon, Loader } from 'semantic-ui-react';

import SearchBar from '../component/SearchBar.js';
import ConjugationTable from '../component/ConjugationTable.js';
import { filterVerbs } from '../logic';
import conjugation from '../../server/server.js'; // delete this later
import spanishdictImage from '../spanishdict.png';
import wordreferenceImage from '../wordreference.png';

const accentButtons = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ'];
const icons = [
  'chess rook',
  'chess knight',
  'chess king',
  'chess bishop',
  'chess queen',
  'chess pawn',
];
const menuDefault = {
  width: '18',
  height: '18',
  src: spanishdictImage,
  as: 'a',
  href: '#',
  style: { marginRight: 10 },
};

const Home = () => {
  let [searchValue, setSearchValue] = useState('');
  let [conjResults, setConjResults] = useState({});
  let [isSearched, setIsSearched] = useState(false);
  // action === idle || loading || verbCheck || addingCollection
  let [action, setAction] = useState('idle');

  const handleFilterResults = value => filterVerbs(value, 5);
  const handleSearchClick = value => {
    setIsSearched(false);
    setAction('loading');
    const result = conjugation(value);
    setIsSearched(!!result); // force to bool
    setConjResults(result);
    setAction('idle');
  };
  const handleAccentClick = (e, accent) => setSearchValue(searchValue + accent);
  return (
    <Grid textAlign="center">
      <Grid.Row>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header
            as="h1"
            content="ℭ𝔦𝔫𝔠𝔬𝔐𝔦𝔫𝔲𝔱𝔬𝔰"
            textAlign="center"
            style={{ fontSize: '4em', marginTop: '2em', marginBottom: '0.5em' }}
          />
          <SearchBar
            onFilterResults={handleFilterResults}
            onSearchClick={handleSearchClick}
            value={searchValue}
            setValue={setSearchValue}
          />
          <br />
          <Button.Group basic size="mini" style={{ margin: '0 auto' }}>
            {accentButtons.map(elem => (
              <Button key={elem} onClick={e => handleAccentClick(e, elem)}>
                {elem}
              </Button>
            ))}
          </Button.Group>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column style={{ maxWidth: 1000 }}>
          <Label
            onClick={() => setAction(action === 'verbCheck' ? 'idle' : 'verbCheck')}
            color={action === 'verbCheck' ? 'blue' : ''}
          >
            <Icon name="pencil" size="large" />
            Verb Check
          </Label>
          <Label
            onClick={() => setAction(action === 'addingCollection' ? 'idle' : 'addingCollection')}
            color={action === 'addingCollection' ? 'blue' : ''}
          >
            <Icon name="list" size="large" />
            Add To Collection
          </Label>
          <Label onClick={() => window.open(conjResults.spanishdictLink)}>
            <Image {...menuDefault} src={spanishdictImage} />
            SpanishDict
          </Label>
          <Label onClick={() => window.open(conjResults.wordreferenceLink)}>
            <Image {...menuDefault} src={wordreferenceImage} />
            WordReference
          </Label>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column style={{ maxWidth: 1000 }}>
          <Segment raised stacked padded>
            {isSearched ? (
              <div>
                <Header as="h2" content={conjResults.verb} textAlign="left" />
                <Header as="h3" content={conjResults.definition} textAlign="left" />
              </div>
            ) : action === 'loading' ? (
              <Loader active content="Loading" inline="centered" />
            ) : (
              <Header as="h2" content="¡Vámos!" textAlign="left" />
            )}
          </Segment>
        </Grid.Column>
      </Grid.Row>
      {isSearched && (
        <Grid.Row>
          <Grid.Column style={{ maxWidth: 1000 }}>
            <ConjugationTable
              raised
              stacked
              icons={icons}
              conjugation={conjResults.conjugation.slice(0, 6)}
            />
          </Grid.Column>
        </Grid.Row>
      )}
    </Grid>
  );
};

Home.propTypes = {
  children: PropTypes.node,
};

export default Home;
