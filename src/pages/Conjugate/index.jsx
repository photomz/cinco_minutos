/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Segment } from 'semantic-ui-react';
import { Redirect, useParams } from 'react-router-dom';

import SearchBar from '../../components/SearchBar';
import ConjugationContainer from '../../components/ConjugationContainer';
import OptionLabels from '../../components/OptionLabels';
import ResultSegment from '../../components/ResultSegment';
import filterVerbs from '../../helper/filterVerbs';
import AccentButtons from '../../components/AccentButtons';

import info from '../../../globals.json';

const Conjugate = () => {
  const { slug } = useParams();
  let [searchValue, setSearchValue] = useState(slug ? slug : '');
  let [{ verb, definition, conjugation }, setConjResults] = useState({});
  let [isSearched, setIsSearched] = useState(false);
  let [placeholder, setPlaceholder] = useState('¡Vámos!');
  // action === idle || loading || verbCheck || addingCollection || redirect
  let [action, setAction] = useState('loading');

  const handleFilterResults = value => filterVerbs(value, 5);

  const handleSearchClick = value => {
    value = decodeURI(value).toLowerCase();
    if (value === verb) return;
    setSearchValue(value);
    setAction('redirect');
  };

  useEffect(() => {
    // Prevent memory leak by aborting fetch when component unmounts
    const abortController = new AbortController();
    const { signal } = abortController;

    fetch(`${info.SERVER_URL}/conjugate?verb=${slug}`, {
      signal,
      headers: {
        verb: slug,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => {
        const decodedSlug = decodeURI(slug);
        if (Object.entries(res).length) setConjResults(res);
        else {
          setConjResults({ verb: decodedSlug });
          setPlaceholder('Invalid verb "' + decodedSlug + '"!');
        }
        setIsSearched(!!Object.entries(res).length); // force to bool
        setAction('idle');
      })
      .catch(err => console.log(err));

    return () => abortController.abort();
  }, [slug]);

  return action === 'verbCheck' ? (
    <Redirect to={`/verbCheck/${verb}`} />
  ) : action === 'redirect' ? (
    <Redirect to={`/conjugate/${searchValue}`} />
  ) : (
    <Grid textAlign="center">
      <Grid.Row>
        <Grid.Column style={{ maxWidth: 450 }}>
          <SearchBar
            style={{ marginTop: '10%' }}
            onFilterResults={handleFilterResults}
            onSearchClick={handleSearchClick}
            value={searchValue}
            setValue={setSearchValue}
            aria-label="search"
            autoFocus
          />
          <br />
          <AccentButtons searchValue={searchValue} setSearchValue={setSearchValue} />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column style={{ maxWidth: '80vw' }}>
          <Segment.Group raised>
            <OptionLabels
              action={action}
              setAction={setAction}
              verb={verb}
              disabled={!isSearched}
            />
            <ResultSegment
              action={action}
              verb={verb}
              def={definition}
              isSearched={isSearched}
              unsearchedVal={placeholder}
              presentPart={conjugation ? conjugation[6].body : ''}
              pastPart={conjugation ? conjugation[7].body : ''}
            />
          </Segment.Group>
        </Grid.Column>
      </Grid.Row>
      {isSearched && (
        <Grid.Row>
          <Grid.Column style={{ maxWidth: '80vw' }}>
            <ConjugationContainer raised conjugation={conjugation.slice(0, 6)} />
          </Grid.Column>
        </Grid.Row>
      )}
    </Grid>
  );
};

Conjugate.propTypes = {
  children: PropTypes.node,
};
export default Conjugate;
