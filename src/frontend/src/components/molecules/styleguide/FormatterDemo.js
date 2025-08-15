import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import BodyText from 'components/atoms/BodyText';
import JapanAddress from 'components/atoms/Formatter/JapanAddress';
import JapanDate from 'components/atoms/Formatter/JapanDate';
import JapanPhoneNumber from 'components/atoms/Formatter/JapanPhoneNumber';
import JapanYen from 'components/atoms/Formatter/JapanYen';
import Heading from 'components/atoms/Heading';

function FormatterDemo() {
  const amounts = [1, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000];
  const addresses = [
    {
      buildingName: '丁目7-29',
      city: '横浜市鶴見区末広町1',
      prefecture: '神奈川県',
      postalCode: '2300045',
    },
    {
      buildingName: '丁目1-2',
      city: '都墨田区押上1',
      prefecture: '東京',
      postalCode: '1310045',
    },
    {
      buildingName: '丁目33-1',
      city: '千葉市若葉区桜木8',
      prefecture: '千葉県',
      postalCode: '2640028',
    },
  ];

  const phones = ['09012345678', '080-5467-9837', '05089301928'];

  return (
    <Box>
      <Heading variant="h5">Yen Helper</Heading>
      <BodyText>
        To display standard Yen values format in the app, make use of the <strong>Yen</strong>{' '}
        helper component. The formatter also automatically adds comma every 3 digits.
      </BodyText>
      <BodyText>
        Do not use the decimal unless specified. The smallest unit is 1 yen. The default yen symbol
        is used.
      </BodyText>
      <SyntaxHighlighter language="javascript" style={monokai}>
        {`import JapanYen from 'components/atoms/Formatter/JapanYen';\n\n<JapanYen amount={5500} />`}
      </SyntaxHighlighter>
      <BodyText>Below are the examples on how it would be displayed:</BodyText>
      {amounts.map((amount) => (
        <Box key={amount}>
          <JapanYen amount={amount} />
        </Box>
      ))}
      <BodyText>
        If you want to use the <strong>kanji</strong> symbol for Yen, just set the props{' '}
        <strong>isKanji={`{true}`}</strong>.
      </BodyText>
      <SyntaxHighlighter language="javascript" style={monokai}>
        {`import JapanYen from 'components/atoms/Formatter/JapanYen';\n\n<JapanYen amount={5500} isKanji={true} />`}
      </SyntaxHighlighter>
      <BodyText>Below are the examples on how it would be displayed:</BodyText>
      {amounts.map((amount) => (
        <Box key={amount}>
          <JapanYen amount={amount} isKanji={true} />
        </Box>
      ))}

      <Divider sx={{ mb: 4 }} />

      <Heading variant="h5">Japan Address Helper</Heading>
      <BodyText>
        To display standard Japan address format in the app, make use of the{' '}
        <strong>JapanAddress</strong> helper component. Make sure to provide the following{' '}
        <strong>Postal Code, Prefecture, City,</strong> and <strong>Building Name</strong>
      </BodyText>
      <SyntaxHighlighter language="javascript" style={monokai}>
        {`import JapanAddress from 'components/atoms/Formatter/JapanAddress';\n
<JapanAddress
  buildingName="丁目1-2"
  city="都墨田区押上1"
  prefecture="東京"
  postalCode="1310045"
/>
`}
      </SyntaxHighlighter>
      <BodyText>Below are the examples on how it would be displayed:</BodyText>
      {addresses.map((address, key) => (
        <Box key={key}>
          <JapanAddress
            buildingName={address.buildingName}
            city={address.city}
            prefecture={address.prefecture}
            postalCode={address.postalCode}
          />
        </Box>
      ))}

      <Divider sx={{ mb: 4 }} />

      <Heading variant="h5">Japan Phone Number Helper</Heading>
      <BodyText>
        To display standard Japan Phone Number format in the app, make use of the{' '}
        <strong>JapanPhoneNumber</strong> helper component. Make sure to provide the{' '}
        <strong>number</strong> prop.
      </BodyText>
      <SyntaxHighlighter language="javascript" style={monokai}>
        {`import JapanPhoneNumber from 'components/atoms/Formatter/JapanPhoneNumber';\n\n<JapanPhoneNumber number="09012345678" />`}
      </SyntaxHighlighter>
      <BodyText>Below are the examples on how it would be displayed:</BodyText>
      {phones.map((phone, key) => (
        <Box key={key}>
          <JapanPhoneNumber number={phone} />
        </Box>
      ))}

      <Divider sx={{ mb: 4 }} />

      <Heading variant="h5">Japan Date Helper</Heading>
      <BodyText>
        To display standard Japan Date format in the app, make use of the <strong>JapanDate</strong>{' '}
        helper component. Make sure to provide the <strong>date</strong> prop. It will always
        display the 24-Hour time format.
      </BodyText>
      <SyntaxHighlighter language="javascript" style={monokai}>
        {`import JapanDate from 'components/atoms/Formatter/JapanDate';\n\n<JapanDate date="2022-07-25 18:45:02" />`}
      </SyntaxHighlighter>
      <BodyText>Below is the example on how it would be displayed:</BodyText>

      <JapanDate date="2022-07-25 18:45:02" hasTime={false} />

      <BodyText>
        If you want to display both date and time, make sure to set the{' '}
        <strong>hasTime={`{true}`}</strong>.
      </BodyText>
      <SyntaxHighlighter language="javascript" style={monokai}>
        {`import JapanDate from 'components/atoms/Formatter/JapanDate';\n\n<JapanDate date="2022-07-25 18:45:02" hasTime={true} />`}
      </SyntaxHighlighter>
      <BodyText>Below is the example on how it would be displayed:</BodyText>

      <JapanDate date="2022-07-25 18:45:02" hasTime={true} />

      <BodyText>
        If not provided, the default value of <strong>separator</strong> prop is{' '}
        <strong>kanji</strong>. Other acceptable values for <strong>separator</strong> are{' '}
        <strong>(forward slash) /</strong> or <strong>(dash) - </strong>.
      </BodyText>
      <SyntaxHighlighter language="javascript" style={monokai}>
        {`import JapanDate from 'components/atoms/Formatter/JapanDate';\n\n<JapanDate date="2022-07-25 18:45:02" hasTime={true} separator="kanji" />`}
      </SyntaxHighlighter>
      {['kanji', '/', '-'].map((separator, key) => (
        <Box key={key}>
          <BodyText>separator: {separator}</BodyText>
          <JapanDate date="2022-07-25 18:45:02" hasTime={true} separator={separator} />
        </Box>
      ))}
    </Box>
  );
}

export default FormatterDemo;
