import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import theme from 'theme';
import { Box, Grid, Typography } from '@mui/material';
import BodyText from 'components/atoms/BodyText';
import Heading from 'components/atoms/Heading';

function PaletteDemo(props) {
  const { colorVariants = ['primary', 'secondary', 'success', 'warning', 'error'] } = props;

  return (
    <Box sx={{ mb: 8 }}>
      <Heading variant="h4" align="center">
        Colors
      </Heading>

      <BodyText>
        These are the color pallete for our current global theme. You can edit the values in{' '}
        <strong>src/frontend/theme/palette.js</strong>
      </BodyText>

      <BodyText>
        The <strong>light, dark,</strong> and <strong>contrastText</strong> for each variant are
        auto generated(computed) by MUI base from the <strong>main</strong> color of the variant you
        provided. If you want to specify <strong>light, dark, and contrastText</strong>
        for each variant, you will need to define it in the{' '}
        <strong>src/frontend/theme/palette.js</strong> file.
      </BodyText>

      <SyntaxHighlighter language="javascript" style={monokai}>
        {`import Typography from '@mui/material/Typography';\n\n<Typography color="primary">Sample Typograpyhy color demo.</Typography>`}
      </SyntaxHighlighter>

      {colorVariants.map((variant) => {
        const keys = Object.keys(theme.palette[variant]).map((style) => (
          <Grid size={{ xs: 3 }} key={style}>
            <Box
              style={{
                backgroundColor: theme.palette[variant][style],
                width: '100%',
                height: '100px',
                borderRadius: theme.spacing(1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: theme.typography.fontSize,
                border: `1px solid ${theme.palette.grey[500]}`,
              }}
            >
              {theme.palette[variant][style]}
            </Box>
            <Typography variant="subtitle2">
              {style == 'main' ? `color="${variant}"` : `color="${variant}.${style}"`}
            </Typography>
          </Grid>
        ));

        return (
          <Box key={variant}>
            <Grid container spacing={4} sx={{ p: 2 }}>
              {keys}
            </Grid>
          </Box>
        );
      })}

      <Box>
        <Grid container spacing={4} sx={{ p: 2 }}>
          <Grid size={{ xs: 3 }}>
            <Box
              style={{
                backgroundColor: theme.palette.text.primary,
                width: '100%',
                height: '100px',
                borderRadius: theme.spacing(1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: theme.typography.fontSize,
              }}
            >
              {theme.palette.text.primary}
            </Box>
            <Typography variant="subtitle2">color=&quot;text.primary&quot;</Typography>
          </Grid>

          <Grid size={{ xs: 3 }}>
            <Box
              style={{
                backgroundColor: theme.palette.text.secondary,
                width: '100%',
                height: '100px',
                borderRadius: theme.spacing(1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: theme.typography.fontSize,
              }}
            >
              {theme.palette.text.secondary}
            </Box>
            <Typography variant="subtitle2">color=&quot;text.secondary&quot;</Typography>
          </Grid>

          <Grid size={{ xs: 3 }}>
            <Box
              style={{
                backgroundColor: theme.palette.text.disabled,
                width: '100%',
                height: '100px',
                borderRadius: theme.spacing(1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: theme.typography.fontSize,
              }}
            >
              {theme.palette.text.disabled}
            </Box>
            <Typography variant="subtitle2">color=&quot;text.disabled&quot;</Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

PaletteDemo.propTypes = {
  colorVariants: PropTypes.array,
};

export default PaletteDemo;
