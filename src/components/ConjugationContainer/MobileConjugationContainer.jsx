import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Label, Table, Segment, Responsive, Header, Accordion } from 'semantic-ui-react';
import nanoid from 'nanoid/non-secure';

const MobileTable = ({ body, j }) => (
  <Table unstackable collapsing textAlign="center" style={{ margin: '0 auto' }}>
    <Table.Body>
      {body.map((rowArr, l) => (
        <Table.Row key={nanoid()}>
          <Table.Cell>{body[l][0]}</Table.Cell>
          <Table.Cell>{rowArr[j + 1]}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);

MobileTable.propTypes = {
  body: PropTypes.array,
  j: PropTypes.number,
};

const MobileAccordion = ({ header, body, j, k, activeIndex, setActiveIndex }) => (
  <Accordion styled style={{ margin: '0 auto' }}>
    <Accordion.Title
      active={activeIndex === k}
      index={k}
      content={<Label content={header} color={activeIndex === k ? 'blue' : null} />}
      onClick={(k => () => setActiveIndex(activeIndex === k ? -1 : k))(k)}
    />
    <Accordion.Content active={activeIndex === k}>
      <MobileTable body={body} j={j} />
    </Accordion.Content>
  </Accordion>
);

MobileAccordion.propTypes = {
  header: PropTypes.string,
  body: PropTypes.array,
  j: PropTypes.number,
  k: PropTypes.number,
  activeIndex: PropTypes.number,
  setActiveIndex: PropTypes.func,
};

const MobileConjugationContainer = ({ conjugation, icons }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  let k = -1; // index for calculating active index
  return (
    <Responsive maxWidth={863}>
      {conjugation.map(({ title, headers, body }, i) => (
        <Segment key={nanoid()}>
          <Header as="h2" content={title} icon={icons[i]} />
          {headers.map((header, j) => {
            k++;
            return (
              <MobileAccordion
                header={header}
                body={body}
                key={nanoid()}
                j={j}
                k={k}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
            );
          })}
        </Segment>
      ))}
    </Responsive>
  );
};

MobileConjugationContainer.propTypes = {
  conjugation: PropTypes.array,
  icons: PropTypes.array,
};

export default MobileConjugationContainer;
