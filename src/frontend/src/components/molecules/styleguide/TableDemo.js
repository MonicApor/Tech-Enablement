import { faker } from '@faker-js/faker';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Box from '@mui/material/Box';
import BodyText from 'components/atoms/BodyText';
import Heading from 'components/atoms/Heading';
import DataTable from 'components/molecules/DataTable';

function TableDemo() {
  const headers = [
    { id: 'id', label: 'ID' },
    { id: 'full_name', label: 'Full Name' },
    { id: 'email', label: 'Email Address' },
  ];

  const users = [...Array(5)].map(() => ({
    id: faker.database.mongodbObjectId(),
    full_name: faker.name.firstName(),
    email: faker.internet.email(),
  }));

  return (
    <Box>
      <Heading variant="h4" align="center">
        Table
      </Heading>

      <BodyText>
        Formatting Table using default MUI Components can be tedious and has a lot of codes.
        Therefore, we will make use of our custom <strong>DataTable</strong> component created
        across the project.
      </BodyText>

      <SyntaxHighlighter language="javascript" style={monokai}>
        {`import DataTable from 'components/molecules/DataTable';\n
const headers = [
  { id: 'id', label: 'ID'},
  { id: 'full_name', label: 'Full Name'},
  { id: 'email', label: 'Email Address'},
];

const users = [
  { id: 1, full_name: 'John Doe', email: 'john@doe.com'},
  ...
  ...
];

<DataTable headers={headers} data={users} page={1} handleSort={() => handleSortFn() } />
`}
      </SyntaxHighlighter>

      <Heading variant="h6">Table with No Toolbar and actions</Heading>
      <BodyText>
        If you want just plain table with data and has no Search Bar and Add, Edit, Delete Buttons.
      </BodyText>
      <SyntaxHighlighter language="javascript" style={monokai}>
        {`<DataTable headers={headers} data={users} toolbar={false} actions={false} />`}
      </SyntaxHighlighter>

      <DataTable
        header={headers}
        data={users}
        toolbar={false}
        actions={false}
        handleSort={() => console.log('trriger sort.')}
      />

      <Heading variant="h6">Table with Toolbar and actions</Heading>
      <BodyText>
        This will include a <strong>Search bar</strong> and <strong>Add New</strong> button in the
        top section of the DataTable.
      </BodyText>
      <SyntaxHighlighter language="javascript" style={monokai}>
        {`import DataTable from 'components/molecules/DataTable';

const headers = [
  { id: 'id', label: 'ID'},
  { id: 'full_name', label: 'Full Name'},
  { id: 'email', label: 'Email Address'},
];

const users = [
  { id: 1, full_name: 'John Doe', email: 'john@doe.com'},
  ...
  ...
];

<DataTable
  headers={headers}
  data={users}
  handleAdd={addHandler}
  handleEdit={editHandler}
  handleDelete={deleteHandler}
  handleSearch={searchHandler}
/>`}
      </SyntaxHighlighter>

      <DataTable
        header={headers}
        data={users}
        handleAdd={() => alert('You clicked "Add New"')}
        handleEdit={(id) => alert(`Edit record ID: ${id}`)}
        handleDelete={(id) => alert(`Delete record ID: ${id}`)}
        handleSearch={(keyword) => alert(`Search Keyword is "${keyword}"`)}
        handleSort={() => alert('Trigger Table Sorting')}
      />
    </Box>
  );
}

export default TableDemo;
