/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Label, Table, Segment, Icon } from 'semantic-ui-react';

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

const ConjugationTable = ({ conjugation, icons, ...props }) => (
  <Segment.Group {...props}>
    {conjugation.map(({ title, headers, body }, i) => (
      <Segment key={title}>
        {/* <Header as="h3" content={title} /> */}
        <Table celled>
          <Table.Header>
            <Table.HeaderCell>
              <Label size="large" color="red" ribbon>
                <Icon name={icons[i]} />
                {title}
              </Label>
            </Table.HeaderCell>
            {headers.map(elem => (
              <Table.HeaderCell key={`${title}_${elem}`}>{elem}</Table.HeaderCell>
            ))}
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
  </Segment.Group>
);

ConjugationTable.propTypes = {
  conjugation: PropTypes.array,
  icons: PropTypes.array,
};

export default ConjugationTable;
