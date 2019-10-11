import React from 'react';
import { Segment } from 'semantic-ui-react';
import styled from 'styled-components';

const StyledSegment = styled(Segment)`
  margin: 25vh 25vw;
  width: 50vw;
  height: auto;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 3em;
  margin: 0 auto;
`;

const GitHub = () => {
  window.location = 'https://github.com/photomz/cinco_minutos';
  return (
    <StyledSegment raised padded>
      <Title>Loading GitHub Page...</Title>
    </StyledSegment>
  );
};

export default GitHub;
