import { useState } from 'react';
import { Box, Container, Tab, Tabs } from '@mui/material';
import PageTitle from 'components/atoms/PageTitle';
import TabPanel from 'components/atoms/TabPanel';
import AccordionDemo from 'components/molecules/styleguide/AccordionDemo';
import ButtonDemo from 'components/molecules/styleguide/ButtonDemo';
import FormComponentsDemo from 'components/molecules/styleguide/FormComponentsDemo';
import FormValidationDemo from 'components/molecules/styleguide/FormValidationDemo';
import FormatterDemo from 'components/molecules/styleguide/FormatterDemo';
import ModalDemo from 'components/molecules/styleguide/ModalDemo';
import PaletteDemo from 'components/molecules/styleguide/PaletteDemo';
import TableDemo from 'components/molecules/styleguide/TableDemo';
import TypographyDemo from 'components/molecules/styleguide/TypographyDemo';

function Styleguide() {
  const [value, setValue] = useState(0);
  const colorVariants = ['primary', 'secondary', 'success', 'warning', 'error'];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const a11yProps = (index) => {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  };

  const tabs = [
    {
      label: 'Typography',
      component: <TypographyDemo />,
    },
    {
      label: 'Colors',
      component: <PaletteDemo colorVariants={colorVariants} />,
    },
    {
      label: 'Buttons',
      component: <ButtonDemo colorVariants={colorVariants} />,
    },
    {
      label: 'Form Components',
      component: <FormComponentsDemo colorVariants={colorVariants} />,
    },
    {
      label: 'Form Validation',
      component: <FormValidationDemo />,
    },
    {
      label: 'Table',
      component: <TableDemo />,
    },
    {
      label: 'Modal',
      component: <ModalDemo />,
    },
    {
      label: 'Accordion',
      component: <AccordionDemo />,
    },
    {
      label: 'Formatter',
      component: <FormatterDemo />,
    },
  ];

  return (
    <Container sx={{ pt: 8 }}>
      <PageTitle
        title="Base Template Styleguide"
        subTitle="This is the Standard Styleguide used across all pages for this Application."
      />

      <Box sx={{ width: '100%', bgcolor: 'background.paper', mt: 8 }}>
        <Box sx={(theme) => ({ borderBottom: `1px solid ${theme.palette.grey[300]}` })}>
          <Tabs
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            value={value}
            onChange={handleChange}
            aria-label="Styleguide"
          >
            {tabs.map((tab, key) => (
              <Tab label={tab.label} {...a11yProps(key)} key={key} />
            ))}
          </Tabs>
        </Box>

        <Box>
          {tabs.map((tab, key) => (
            <TabPanel value={value} index={key} sx={{ width: '100%' }} key={key}>
              {tab.component}
            </TabPanel>
          ))}
        </Box>
      </Box>
    </Container>
  );
}

export default Styleguide;
