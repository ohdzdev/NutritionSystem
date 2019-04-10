import React, { useState } from 'react';
import Select from 'react-select';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';

const styles = theme => ({
  input: {
    display: 'flex',
    padding: theme.spacing.unit,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  noOptionsMessage: {
    padding: theme.spacing.unit,
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  selectedFontColor: {
    color: theme.palette.primary,
  },
  standardFontColor: {
    color: theme.palette.font,
  },
  optionCell: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
});

const NoOptionsMessage = (props) => (
  <Typography
    color="textSecondary"
    className={props.selectProps.classes.noOptionsMessage}
    {...props.innerProps}
  >
    {props.children}
  </Typography>
);

NoOptionsMessage.propTypes = {
  selectProps: PropTypes.shape({
    classes: PropTypes.shape({
      noOptionsMessage: PropTypes.string.isRequired,
    }),
  }).isRequired,
  innerProps: PropTypes.object,
  children: PropTypes.string.isRequired,
};

NoOptionsMessage.defaultProps = {
  innerProps: {},
};

const inputComponent = ({ inputRef, ...props }) => <div ref={inputRef} {...props} />;

inputComponent.propTypes = {
  inputRef: PropTypes.func.isRequired,
};

const Control = (props) => (
  <TextField
    id={String(new Date().toTimeString())}
    fullWidth
    InputProps={{
      inputComponent,
      inputProps: {
        className: props.selectProps.classes.input,
        inputRef: props.innerRef,
        children: props.children,
        ...props.innerProps,
      },
    }}
    variant="outlined"
    {...props.selectProps.textFieldProps}
  />
);

Control.propTypes = {
  selectProps: PropTypes.shape({
    classes: PropTypes.shape({
      input: PropTypes.string.isRequired,
    }),
    textFieldProps: PropTypes.object,
  }).isRequired,
  innerRef: PropTypes.func.isRequired,
  children: PropTypes.array.isRequired,
  innerProps: PropTypes.object,
};

Control.defaultProps = {
  innerProps: {},
};

const Option = (props) => (
  <MenuItem
    buttonRef={props.innerRef}
    selected={props.isFocused}
    component="div"
    style={{
      fontWeight: props.isSelected ? 500 : 400,
    }}
    {...props.innerProps}
  >
    {props.children}
  </MenuItem>
);

Option.propTypes = {
  innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  isFocused: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  innerProps: PropTypes.object,
  children: PropTypes.string.isRequired,
};

Option.defaultProps = {
  innerProps: {},
  innerRef: React.createRef(),
};

const Placeholder = (props) => (
  <Typography
    color="textSecondary"
    className={props.selectProps.classes.placeholder}
    {...props.innerProps}
  >
    {props.children}
  </Typography>
);

Placeholder.propTypes = {
  selectProps: PropTypes.shape({
    classes: PropTypes.shape({
      placeholder: PropTypes.string.isRequired,
    }),
    textFieldProps: PropTypes.object,
  }).isRequired,
  children: PropTypes.string.isRequired,
  innerProps: PropTypes.object,
};

Placeholder.defaultProps = {
  innerProps: {},
};

const SingleValue = (props) => (
  <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
    {props.children}
  </Typography>
);

SingleValue.propTypes = {
  selectProps: PropTypes.shape({
    classes: PropTypes.shape({
      singleValue: PropTypes.string.isRequired,
    }),
    textFieldProps: PropTypes.object,
  }).isRequired,
  innerProps: PropTypes.object,
  children: PropTypes.string.isRequired,
};

SingleValue.defaultProps = {
  innerProps: {},
};

const ValueContainer = (props) => <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;

ValueContainer.propTypes = {
  selectProps: PropTypes.shape({
    classes: PropTypes.shape({
      valueContainer: PropTypes.string.isRequired,
    }),
    textFieldProps: PropTypes.object,
  }).isRequired,
  children: PropTypes.array.isRequired,
};

const Menu = (props) => (
  <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
    {props.children}
  </Paper>
);

Menu.propTypes = {
  selectProps: PropTypes.shape({
    classes: PropTypes.shape({
      paper: PropTypes.string.isRequired,
    }),
  }).isRequired,
  innerProps: PropTypes.object,
  children: PropTypes.object.isRequired,
};

Menu.defaultProps = {
  innerProps: {},
};

const components = {
  Control,
  Menu,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

const IntegrationReactSelect = (props) => {
  const {
    label, suggestions, onChange, classes, theme, field, form, helperText, error, value,
  } = props;
  const [selected, setSelected] = useState(false);

  function handleChangeSingle(v) {
    if (form) {
      form.setFieldValue(field.name, v.value || null);
    } else {
      onChange(v || { value: null });
    }
  }

  const selectStyles = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit',
      },
    }),
  };
  return (
    <NoSsr>
      {label &&
      <Typography color={selected ? 'primary' : 'textPrimary'}>
        {label}
      </Typography>
      }
      <Select
        classes={classes}
        styles={selectStyles}
        options={suggestions}
        name={field.name || ''}
        components={components}
        // defaultValue={suggestions.find((item) => item.value == defaultValue) || ''} // eslint-disable-line eqeqeq
        value={suggestions.find((item) => item.value == value) || ''} // eslint-disable-line eqeqeq
        onChange={handleChangeSingle}
        onFocus={() => {
          setSelected(true);
          if (form) {
            form.setFieldTouched(field.name, true, true);
          }
        }}
        onBlur={() => setSelected(false)}
        id={props.id}
      />
      {(error || helperText) &&
        <Typography color={error ? 'error' : 'textPrimary'}>
          {helperText}
        </Typography>
      }
    </NoSsr>
  );
};

IntegrationReactSelect.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]),
  })).isRequired,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  field: PropTypes.shape({
    name: PropTypes.string,
  }),
  form: PropTypes.object,
  helperText: PropTypes.string,
  error: PropTypes.bool,
};

IntegrationReactSelect.defaultProps = {
  onChange: () => {},
  value: '',
  label: '',
  id: Math.random(1000),
  field: {},
  form: undefined,
  helperText: '',
  error: false,
};

export default withTheme()(withStyles(styles, { withTheme: true })(IntegrationReactSelect));
