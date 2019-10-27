/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';

import { SearchBar, AccentButtons } from '../../components/landing';
import { ConjugationContainer, OptionLabels, ResultSegment } from '../../components/conjugate';
import filterVerbs from '../../helper/filterVerbs';

import info from '../../../globals.json';

const Conjugate = ({ history }) => {
  const { slug } = useParams();
  let [searchValue, setSearchValue] = useState(slug ? slug : '');
  let [{ verb, definition, conjugation }, setConjResults] = useState({});
  let [isSearched, setIsSearched] = useState(false);
  let [placeholder, setPlaceholder] = useState('¡Vámos!');
  // action === idle || loading || verbCheck || addingCollection
  let [action, setAction] = useState('loading');

  const handleFilterResults = value => filterVerbs(value, 5);

  const handleSearchClick = value => {
    value = decodeURI(value).toLowerCase();
    if (value === verb) return;
    setSearchValue(value);
    history.push(`/conjugate/${value}`);
  };

  useEffect(() => {
    // Prevent memory leak by aborting fetch when component unmounts
    const abortController = new AbortController();
    const { signal } = abortController;
    setIsSearched(false);
    setTimeout(() => {
      abortController.abort();
      setPlaceholder(`Couldn't get conjugation of ${slug}! Please try again later.`);
    }, 10000);

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
        const decodedSlug = decodeURIComponent(slug);
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

  return (
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
  history: PropTypes.object,
};
export default Conjugate;
