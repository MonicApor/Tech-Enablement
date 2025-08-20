import { faker } from '@faker-js/faker';
import PropTypes from 'prop-types';
import { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Checkbox as MuiCheckbox,
  RadioGroup as MuiRadioGroup,
  Select as MuiSelect,
  TextField as MuiTextField,
  Radio,
} from '@mui/material';
import BodyText from 'components/atoms/BodyText';
import Checkbox from 'components/atoms/Form/Checkbox';
import DatePicker from 'components/atoms/Form/DatePicker';
import RadioGroup from 'components/atoms/Form/RadioGroup';
import Select from 'components/atoms/Form/Select';
import TextField from 'components/atoms/Form/TextField';
import Heading from 'components/atoms/Heading';

function FormComponentsDemo(props) {
  const [birthday, setBirthday] = useState(null);
  const [eventDateTime, setEventDateTime] = useState(null);
  const { colorVariants = ['primary', 'secondary', 'success', 'warning', 'error'] } = props;

  return (
    <Box sx={{ mb: 8 }}>
      <Heading variant="h4" align="center">
        Form Components
      </Heading>

      <Heading variant="h6">TextField (Input Field)</Heading>
      <BodyText>
        Usually, the default MUI TextField is used in forms. However, there are cases where
        developer tends to override it causing inconsistensy on other pages.
      </BodyText>
      <SyntaxHighlighter language="javascript" style={monokai}>
        {`import TextField from '@mui/material/TextField';\n\n<TextField label="Username" error={true} helperText="Field with validation error" />`}
      </SyntaxHighlighter>

      <Box sx={{ mb: 2 }}>
        <MuiTextField label="Username" sx={{ mr: 2, mb: 2 }} />

        <MuiTextField
          label="Username"
          defaultValue="admin@sample"
          error={true}
          helperText="Field with validation errors"
        />
      </Box>

      <BodyText>
        Therefore, we will use our custom TextField component with initial styling derived from the{' '}
        <strong>TextField</strong> component of MUI with additional styling that will match our
        system needs. All the TextField props from MUI are inherited by this custom component.
      </BodyText>

      <SyntaxHighlighter language="javascript" style={monokai}>
        {`import TextField from 'components/atoms/Form/TextField';\n\n<TextField label="Username" error={true} helperText="Field with validation error" />`}
      </SyntaxHighlighter>

      <Box>
        <TextField label="Username" sx={{ mr: 2, mb: 2 }} />

        <TextField
          label="Username"
          defaultValue="admin@sample"
          error={true}
          helperText="Field with validation errors"
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <Heading variant="h6">Multiline Textfield example.</Heading>
        <SyntaxHighlighter language="javascript" style={monokai}>
          {`import TextField from 'components/atoms/Form/TextField';\n\n<TextField label="Description" multiline />`}
        </SyntaxHighlighter>
        <TextField
          label="Description"
          defaultValue={faker.lorem.paragraphs(2)}
          multiline
          minRows={4}
          fullWidth
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <Heading variant="h6">File Select Textfield</Heading>
        <SyntaxHighlighter language="javascript" style={monokai}>
          {`import TextField from 'components/atoms/Form/TextField';\n\n<TextField label="Attachment" type="file"/>`}
        </SyntaxHighlighter>
        <TextField label="Attachment" type="file" fullWidth />
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Heading variant="h6" align="center">
          Checkboxes
        </Heading>

        <BodyText>
          Usually, the default MUI Checkbox is used in Forms. It has no paired label.
        </BodyText>
        <SyntaxHighlighter language="javascript" style={monokai}>
          {`import Checkbox from '@mui/material/Checkbox';\n\n<Checkbox defaultChecked />`}
        </SyntaxHighlighter>

        <Box>
          <MuiCheckbox defaultChecked />
        </Box>

        <BodyText>
          Therefore, we will use our custom Checkbox component with initial styling derived from the{' '}
          <strong>Checkbox</strong> component of MUI with additional styling that will match our
          system needs. All the Checkbox props from MUI are inherited by this custom component.
        </BodyText>

        <SyntaxHighlighter language="javascript" style={monokai}>
          {`import Checkbox from 'components/atoms/Checkbox';\n\n<Checkbox label="Accept Terms" />`}
        </SyntaxHighlighter>

        {colorVariants.map((color) => (
          <Box key={color}>
            <Checkbox label="Accept Terms" color={color} defaultChecked />
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Heading variant="h6">Select</Heading>

        <BodyText>
          Usually, the default MUI Select is used in Forms. However, you will still need to format
          using several components.
        </BodyText>
        <SyntaxHighlighter language="javascript" style={monokai}>
          {`import { Select, FormControl, InputLabel, Select } from '@mui/material';\n
<FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Gender</InputLabel>
  <MuiSelect label="Gender">
    <MenuItem value="Male">Male</MenuItem>
    <MenuItem value="Female">Female</MenuItem>
  </MuiSelect>
</FormControl>`}
        </SyntaxHighlighter>

        <Box sx={{ mb: 2, maxWidth: 300 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
            <MuiSelect label="Gender" defaultValue="">
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </MuiSelect>
          </FormControl>
        </Box>

        <BodyText>
          Therefore, we will use our custom Select component with initial styling derived from the{' '}
          <strong>Select</strong> component of MUI with additional styling that will match our
          system needs. All the Select props from MUI are inherited by this custom component.
        </BodyText>

        <SyntaxHighlighter language="javascript" style={monokai}>
          {`import Select from 'components/atoms/Form/Select';\n
// set the options
const options = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];

// One Line Only
<Select label="Gender" options={options} />`}
        </SyntaxHighlighter>

        <Box sx={{ mb: 2, maxWidth: 300 }}>
          <Select
            label="Gender"
            options={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
            ]}
            defaultValue=""
          />
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Heading variant="h6">Radio Button</Heading>

        <BodyText>
          Usually, the default MUI Radio is used in Forms. However, you will still need to format
          using several components.
        </BodyText>
        <SyntaxHighlighter language="javascript" style={monokai}>
          {`import { Radio, FormControl, RadioGroup, FormControlLabel, FormLabel } from '@mui/material';\n
<FormControl>
  <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
  <RadioGroup
    aria-labelledby="demo-radio-buttons-group-label"
    name="radio-buttons-group"
  >
    <FormControlLabel value="male" control={<Radio />} label="Male" />
    <FormControlLabel value="female" control={<Radio />} label="Female" />
  </RadioGroup>
</FormControl>`}
        </SyntaxHighlighter>

        <Box>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
            <MuiRadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
            </MuiRadioGroup>
          </FormControl>
        </Box>

        <BodyText>
          Therefore, we will use our custom RadioGroup component with initial styling derived from
          the <strong>RadioGroup</strong> component of MUI with additional styling that will match
          our system needs. All the RadioGroup props from MUI are inherited by this custom
          component.
        </BodyText>
        <SyntaxHighlighter language="javascript" style={monokai}>
          {`import RadioGroup from 'components/atoms/Form/RadioGroup';\n
// set the options
const options = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];

// One Line Only
<RadioGroup label="Gender" options={options} />`}
        </SyntaxHighlighter>

        <Box sx={{ mb: 2, maxWidth: 300 }}>
          <RadioGroup
            label="Gender"
            options={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
            ]}
          />
        </Box>

        <BodyText>
          If you want the options to be inline, just specify <strong>inline=true</strong>
        </BodyText>

        <SyntaxHighlighter language="javascript" style={monokai}>
          {`import RadioGroup from 'components/atoms/Form/RadioGroup';\n
// set the options
const options = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
];

// One Line Only
<RadioGroup label="Gender" options={options} inline={true} />`}
        </SyntaxHighlighter>

        <Box sx={{ mb: 2, maxWidth: 300 }}>
          <RadioGroup
            label="Gender"
            options={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' },
            ]}
            inline={true}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box>
        <Heading variant="h6">DatePicker</Heading>
        <BodyText>
          To make use of the custom <strong>DatePicker</strong> component, you will need to pass the{' '}
          <strong>label, name, value, handleOnChange</strong> props. You can pass the date{' '}
          <strong>format</strong> props as optional.
        </BodyText>

        <SyntaxHighlighter language="javascript" style={monokai}>
          {`import { useState } from 'react';\n
import DatePicker from 'components/atoms/Form/DatePicker';

function Signup() {
  const [birthday, setBirthday] = useState(null);
  const handleOnChange = (newValue) => setBirthday(newValue);

  return (
    <form>
      <DatePicker
        label="Birthday"
        name="Birthday"
        value={birthday}
        onChange={handleOnChange}
      />

      <button type="submit">Submit</button>
    </form>
  )
}>`}
        </SyntaxHighlighter>

        <DatePicker label="Birthday" name="Birthday" value={birthday} onChange={setBirthday} />

        <Box sx={{ mt: 2 }}>
          <BodyText>
            If you want to add a <strong>timepicker</strong>, you need to pass the boolean{' '}
            <strong>hasTime</strong> props.
          </BodyText>

          <SyntaxHighlighter language="javascript" style={monokai}>
            {`import { useState } from 'react';\n
import DatePicker from 'components/atoms/Form/DatePicker';

function Rsvp() {
  const [eventDateTime, setEventDateTime] = useState(null);
  const handleOnChange = (newValue) => setEventDateTime(newValue);

  return (
    <form>
      <DatePicker
        label="Event Date & Time"
        name="event"
        value={eventDateTime}
        onChange={handleOnChange}
        hasTime={true}
      />

      <button type="submit">Submit</button>
    </form>
  )
}>`}
          </SyntaxHighlighter>

          <DatePicker
            label="Event DateTime"
            name="event"
            value={eventDateTime}
            onChange={setEventDateTime}
            hasTime={true}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Heading variant="h6">Using react-hook-form on DatePicker</Heading>
          <BodyText>
            If you want to integrate <strong>react-hook-form</strong> validation for the custom{' '}
            <strong>DatePicker</strong> component, you will need to pass the{' '}
            <strong>label, name, control</strong> props. The <strong>control</strong> variable is
            from the <strong>react-hook-form</strong> <strong>useForm</strong> hook. You can pass
            the date <strong>format</strong> props as optional.
          </BodyText>

          <SyntaxHighlighter language="javascript" style={monokai}>
            {`import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import DatePicker from 'components/atoms/Form/DatePicker';

function Signup() {
  const schema = yup.object({
    birthday: yup
      .date()
      .required()
      .typeError('Please select a valid date')
      .nullable(),
  });

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { birthday: null },
  });

  const handleSignup = (formData) => {
    // your logic here
  }

  return (
    <form onSubmit={handleSubmit(handleSignUp)}>
      <DatePicker
        label="Birthday"
        name="Birthday"
        error={errors && errors.birthday ? true : false}
        helperText={errors ? errors?.birthday?.message : null}
      />

      <button type="submit">Submit</button>
    </form>
  )
}>`}
          </SyntaxHighlighter>

          <BodyText>
            You can see the actual demo and react-hook-form integration to the DatePicker on the{' '}
            <strong>Form Validation</strong> tab.
          </BodyText>

          <BodyText>
            <strong>IMPORTANT: </strong> The returned value of the DatePicker is always in{' '}
            <strong>UTC+0</strong> format, so you will need to convert it first to your preferred
            timezone before submitting it to your backend API.
          </BodyText>
        </Box>
      </Box>
    </Box>
  );
}

FormComponentsDemo.propTypes = {
  colorVariants: PropTypes.array,
};

export default FormComponentsDemo;
