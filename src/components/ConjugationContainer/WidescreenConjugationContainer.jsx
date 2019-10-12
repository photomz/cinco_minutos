import React from 'react';
import PropTypes from 'prop-types';
import { Label, Table, Segment, Icon, Responsive } from 'semantic-ui-react';
import nanoid from 'nanoid/non-secure';

const WidescreenConjugationContainer = ({ conjugation, icons }) => (
  <Responsive minWidth={864}>
    {conjugation.map(({ title, headers, body }, i) => (
      <Segment key={nanoid()}>
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
                <Table.HeaderCell key={nanoid()}>{elem}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {body.map(rowArr => (
              <Table.Row key={nanoid()}>
                {rowArr.map(elem => (
                  <Table.Cell
                    key={nanoid()}
                    style={{ overflowWrap: 'break-word', hyphens: 'auto' }}
                  >
                    {elem}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
    ))}
  </Responsive>
);

WidescreenConjugationContainer.propTypes = {
  conjugation: PropTypes.array,
  icons: PropTypes.array,
};

export default WidescreenConjugationContainer;
