import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import theme from 'theme';
import { Box, Button as MuiButton } from '@mui/material';
import BodyText from 'components/atoms/BodyText';
import Button from 'components/atoms/Button';
import Heading from 'components/atoms/Heading';

function ButtonDemo(props) {
  const { colorVariants = ['primary', 'secondary', 'success', 'warning', 'error'] } = props;

  return (
    <Box sx={{ mb: 8 }}>
      <Heading variant="h4" align="center">
        Buttons
      </Heading>
      <BodyText>
        Usually, the default MUI button is used in pages and forms. However, there are cases where
        developer tends to override it causing inconsistensy on other pages.
      </BodyText>
      <SyntaxHighlighter language="javascript" style={monokai}>
        {`import Button from '@mui/material/Button';\n\n<Button color="primary" variant="contained">Click Me</Button>`}
      </SyntaxHighlighter>

      <MuiButton color="primary" variant="contained" sx={{ display: 'block', mb: 4 }}>
        Click Me
      </MuiButton>

      <BodyText>
        Therefore, we will use our custom Button component with initial styling derived from the{' '}
        <strong>Button</strong> component of MUI with additional styling that will match our system
        needs. All the Button props from MUI are inherited by this custom component.
      </BodyText>

      <SyntaxHighlighter language="javascript" style={monokai}>
        {`import Button from 'components/atoms/Button';\n\n<Button color="primary">Click Me</Button>`}
      </SyntaxHighlighter>

      <Box sx={{ mb: 4 }}>
        {colorVariants.map((color) => (
          <Button
            key={color}
            color={color}
            onClick={() => alert(`You clicked the ${color} button color`)}
            sx={{ mr: 2 }}
          >
            {color}
          </Button>
        ))}
      </Box>

      <BodyText>This is our standard button property.</BodyText>
      <SyntaxHighlighter language="javascript" style={monokai}>
        {`font-size: ${theme.typography.button.fontSize};\npadding: 6px 8px;\nborder-radius: 4px;`}
      </SyntaxHighlighter>
    </Box>
  );
}

ButtonDemo.propTypes = {
  colorVariants: PropTypes.array,
};

export default ButtonDemo;
