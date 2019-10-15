import React from 'react';
import PropTypes from 'prop-types';
import { Label, Table, Segment, Icon, Responsive } from 'semantic-ui-react';
import nanoid from 'nanoid/non-secure';

const WidescreenTableHeader = ({ icon, moodTitle, tenseHeaders }) => (
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>
        <Label size="large" color="red" ribbon>
          <Icon name={icon} />
          {moodTitle}
        </Label>
      </Table.HeaderCell>
      {tenseHeaders.map(elem => (
        <Table.HeaderCell key={nanoid()}>{elem}</Table.HeaderCell>
      ))}
    </Table.Row>
  </Table.Header>
);

WidescreenTableHeader.propTypes = {
  icon: PropTypes.string,
  moodTitle: PropTypes.string,
  tenseHeaders: PropTypes.array,
};

const WidescreenTableBody = ({ columns }) => (
  <Table.Body>
    {columns.map(rows => (
      <Table.Row key={nanoid()}>
        {rows.map(conj => (
          <Table.Cell key={nanoid()} style={{ overflowWrap: 'break-word', hyphens: 'auto' }}>
            {conj}
          </Table.Cell>
        ))}
      </Table.Row>
    ))}
  </Table.Body>
);

WidescreenTableBody.propTypes = {
  columns: PropTypes.array,
};

const WidescreenConjugationContainer = ({ conjugation, icons }) => (
  <Responsive minWidth={864}>
    {conjugation.map(({ title, headers, body }, i) => (
      <Segment key={nanoid()}>
        <Table celled>
          <WidescreenTableHeader icon={icons[i]} moodTitle={title} tenseHeaders={headers} />
          <WidescreenTableBody columns={body} />
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
