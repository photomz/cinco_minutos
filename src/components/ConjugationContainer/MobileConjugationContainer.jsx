import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Label, Table, Segment, Responsive, Header, Accordion } from 'semantic-ui-react';
import nanoid from 'nanoid/non-secure';

const MobileConjugationContainer = ({ conjugation, icons }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  let k = -1; // index for calculating active index
  return (
    <Responsive maxWidth={863}>
      {conjugation.map(({ title, headers, body }, i) => {
        //const newHeaders = body.map(rowArr => rowArr[0]); // yo, tu ,... headers
        return (
          <Segment key={nanoid()}>
            <Header as="h2" content={title} icon={icons[i]} />
            {headers.map((elem, j) => {
              k++;
              return (
                <Accordion key={nanoid()} styled style={{ margin: '0 auto' }}>
                  <Accordion.Title
                    active={activeIndex === k}
                    index={k}
                    content={<Label content={elem} color={activeIndex === k ? 'blue' : null} />}
                    onClick={(k => () => setActiveIndex(activeIndex === k ? -1 : k))(k)}
                  />
                  <Accordion.Content active={activeIndex === k}>
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
                  </Accordion.Content>
                </Accordion>
              );
            })}
          </Segment>
        );
      })}
    </Responsive>
  );
};

MobileConjugationContainer.propTypes = {
  conjugation: PropTypes.array,
  icons: PropTypes.array,
};

export default MobileConjugationContainer;
