import { faker } from '@faker-js/faker';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import theme from 'theme';
import { Box, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import BodyText from 'components/atoms/BodyText';
import Heading from 'components/atoms/Heading';

function TypographyDemo(props) {
  const { headingVariants = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] } = props;

  return (
    <Box>
      <Heading variant="h4" align="center">
        Typography
      </Heading>
      <BodyText>
        The current global theme font-family is <strong>{theme.typography.fontFamily}</strong>. You
        can edit and change the values in <strong>src/frontend/theme/typography.js</strong>
      </BodyText>

      <BodyText>
        We are using <strong>rem</strong> as unit of measurement. <strong>1 rem === 16px</strong>
      </BodyText>

      <Typography variant="h6">Heading Component</Typography>

      <BodyText>
        Usually, the default Typography component is used to declare headings. However, there are
        cases where developer tends to override it causing inconsistensy on other pages.
      </BodyText>
      <SyntaxHighlighter language="javascript" style={monokai}>
        {`import Typography from '@mui/material/Typography';\n\n<Typography variant="h1">This is a heading</Typography>`}
      </SyntaxHighlighter>

      <BodyText>
        Therefore, we will use our custom Heading component with initial styling derived from the{' '}
        <strong>Typography</strong> component of MUI with additional styling that will match our
        system needs.
      </BodyText>

      <SyntaxHighlighter language="javascript" style={monokai}>
        {`import Heading from 'components/atoms/Heading';\n\n<Heading variant="h1">This is a heading</Heading>`}
      </SyntaxHighlighter>

      {headingVariants.map((variant) => (
        <Box key={variant}>
          <Heading variant={variant}>
            This is a sample {variant} heading ({theme.typography[variant].fontSize})
          </Heading>
        </Box>
      ))}

      <Divider sx={{ mb: 8 }} />

      <Typography variant="h6">Body Text</Typography>

      <Typography variant="p">
        Usually, the default Typography component is used to render text in the page. However, there
        are cases where developer tends to override it causing inconsistensy on other pages.
      </Typography>
      <SyntaxHighlighter language="javascript" style={monokai}>
        {`import Typography from '@mui/material/Typography';\n\n<Typography>This is a sample text.</Typography>`}
      </SyntaxHighlighter>

      <Typography variant="body1">
        Therefore, we will use our custom BodyText component with initial styling derived from the{' '}
        <strong>Typography</strong> component of MUI with additional styling that will match our
        system needs.
      </Typography>

      <SyntaxHighlighter language="javascript" style={monokai}>
        {`import BodyText from 'components/atoms/BodyText';\n\n<BodyText>This is a sample text.</BodyText>`}
      </SyntaxHighlighter>

      <BodyText>
        The default body font size is <strong>({theme.typography.body1.fontSize})</strong>. Below is
        the sample body text in paragraph.
      </BodyText>

      <BodyText>{faker.lorem.paragraphs(2)}</BodyText>
    </Box>
  );
}

TypographyDemo.propTypes = {
  headingVariants: PropTypes.array,
};

export default TypographyDemo;
