/* eslint-disable no-console */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Label, Table, Segment, Icon, Responsive, Header, Accordion } from 'semantic-ui-react';

const MobileAccordion = ({ conjugation, icons }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  let k = -1; // index for calculating active index
  return (
    <Responsive maxWidth={790}>
      {conjugation.map(({ title, headers, body }, i) => {
        //const newHeaders = body.map(rowArr => rowArr[0]); // yo, tu ,... headers
        return (
          <Segment key={title}>
            <Header as="h2" content={title} icon={icons[i]} />
            {headers.map((elem, j) => {
              k++;
              return (
                <Accordion key={`${title}_${elem}`} styled>
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
                          <Table.Row key={`${title}_${elem}_${rowArr[j + 1]}`}>
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

MobileAccordion.propTypes = {
  conjugation: PropTypes.array,
  icons: PropTypes.array,
};

const WidescreenTable = ({ conjugation, icons }) => (
  <Responsive minWidth={790}>
    {conjugation.map(({ title, headers, body }, i) => (
      <Segment key={title}>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Label size="large" color="red" ribbon>
                  <Icon name={icons[i]} />
                  {title}
                </Label>
              </Table.HeaderCell>
              {headers.map(elem => (
                <Table.HeaderCell key={`${title}_${elem}`}>{elem}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {body.map((rowArr, i) => (
              <Table.Row key={`${title}_${i}`}>
                {rowArr.map((elem, j) => (
                  <Table.Cell key={`${title}_${i}_${j}`}>{elem}</Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
    ))}
  </Responsive>
);

WidescreenTable.propTypes = {
  conjugation: PropTypes.array,
  icons: PropTypes.array,
};

const ConjugationTable = ({ conjugation, icons, ...props }) => (
  <Segment.Group {...props}>
    <MobileAccordion conjugation={conjugation} icons={icons} />
    <WidescreenTable conjugation={conjugation} icons={icons} />
  </Segment.Group>
);

ConjugationTable.propTypes = {
  conjugation: PropTypes.array,
  icons: PropTypes.array,
};

export default ConjugationTable;

// const errorMessage = (propName, componentName, length, actual, rowOrCol) =>
//   new Error(
//     `Invalid prop ${propName} supplied to ${componentName}. Length of ${rowOrCol} of ${length} did not match supplied ${rowOrCol} length of ${actual}.`,
//   );

// const isValidArr = (rowNum, colNum) => (props, propName, componentName) => {
//   [...Object.values(props[propName])].forEach(row => {
//     if (row.length !== rowNum)
//       return errorMessage(propName, componentName, rowNum, row.length, 'row');
//     [...row].forEach(col => {
//       if (col.length !== colNum)
//         return errorMessage(propName, componentName, colNum, col.length, 'column');
//     });
//   });
// };
