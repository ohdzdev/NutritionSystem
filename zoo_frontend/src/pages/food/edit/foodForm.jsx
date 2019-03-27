/* eslint-disable react/jsx-no-bind */
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';

export const DisplayFormikState = props => (
  <div style={{ margin: '1rem 0' }}>
    <pre
      style={{
        background: '#f6f8fa',
        fontSize: '.65rem',
        padding: '.5rem',
      }}
    >
      <strong>props</strong> ={' '}
      {JSON.stringify(props, null, 2)}
    </pre>
  </div>
);

const formikEnhancer = withFormik({
  validationSchema: Yup.object().shape({
    food: Yup.string().required('Name is required'),
    sciName: Yup.string().nullable(),
    manufacturerName: Yup.string().nullable(),
    ohdzName: Yup.string().nullable(),
  }),
  mapPropsToValues: props => ({
    food: props.food,
    sciName: props.sciName,
    manufacturerName: props.manufacturerName,
    ohdzName: props.ohdzName,
    topics: [],
  }),
  handleSubmit: (values, { setSubmitting }) => {
    const payload = {
      ...values,
      topics: values.topics.map(t => t.value),
    };
    setTimeout(() => {
      alert(JSON.stringify(payload, null, 2));
      setSubmitting(false);
    }, 1000);
  },
  displayName: 'MyForm',
});


const Form = props => {
  const {
    values: {
      sciName, manufacturerName, ohdzName, food, costG, budgetId, category, usdaFoodGrouDesc, dry, meat, preChop, preBag, active,
    },
    errors,
    touched,
    handleChange,
    isValid,
    setFieldTouched,
  } = props;

  console.log(props.values);
  const change = (name, e) => {
    e.persist();
    handleChange(e);
    setFieldTouched(name, true, false);
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.handleSubmit(e);
      }}
    >
      <Grid container>
        <Grid item xs="12" md="4" spacing="16" style={{ padding: '10px' }}>
          <TextField
            id="food"
            name="food"
            helperText={touched.food ? errors.food : ''}
            error={touched.food && Boolean(errors.food)}
            label="Food Name"
            defaultValue={food}
            value={food}
            onChange={change.bind(null, 'food')}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs="12" md="4" spacing="16" style={{ padding: '10px' }}>
          <TextField
            id="sciName"
            name="sciName"
            helperText={touched.sciName ? errors.sciName : ''}
            error={touched.sciName && Boolean(errors.sciName)}
            label="Sci Name"
            value={sciName}
            onChange={change.bind(null, 'sciName')}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs="12" md="4" spacing="16" style={{ padding: '10px' }}>
          <TextField
            id="manufacturerName"
            name="manufacturerName"
            helperText={touched.manufacturerName ? errors.manufacturerName : ''}
            error={touched.manufacturerName && Boolean(errors.manufacturerName)}
            label="Manufacturer Name"
            fullWidth
            variant="outlined"
            value={manufacturerName}
            onChange={change.bind(null, 'manufacturerName')}
          />
        </Grid>
        <Grid item xs="12" md="4" spacing="16" style={{ padding: '10px' }}>
          <TextField
            id="ohdzName"
            name="ohdzName"
            helperText={touched.ohdzName ? errors.ohdzName : ''}
            error={touched.ohdzName && Boolean(errors.ohdzName)}
            label="OHDZ Name"
            fullWidth
            variant="outlined"
            value={ohdzName}
            onChange={change.bind(null, 'ohdzName')}
          />
        </Grid>
        <Grid item xs="12" sm="6" />
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        disabled={!isValid}
      >
        Submit
      </Button>
      <DisplayFormikState {...props} />
    </form>
  );
};

Form.propTypes = {
  values: PropTypes.shape({
    sciName: PropTypes.string.isRequired,
    manufacturerName: PropTypes.string.isRequired,
    ohdzName: PropTypes.string.isRequired,
    food: PropTypes.string.isRequired,
    costG: PropTypes.number.isRequired,
    budgetId: PropTypes.number,
    category: PropTypes.number,
    usdaFoodGrouDesc: PropTypes.number,
    dry: PropTypes.number.isRequired,
    meat: PropTypes.number.isRequired,
    preChop: PropTypes.number.isRequired,
    preBag: PropTypes.number.isRequired,
    active: PropTypes.number.isRequired,
  }).isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  // dirty: PropTypes.bool.isRequired,
};

class FormikSelect extends React.Component {
  handleChange = value => {
    // this is going to call setFieldValue and manually update values.topcis
    this.props.onChange('topics', value);
  };

  handleBlur = () => {
    // this is going to call setFieldTouched and manually update touched.topcis
    this.props.onBlur('topics', true);
  };

  render() {
    return (
      <div style={{ margin: '1rem 0' }}>
        {/* eslint-disable jsx-a11y/label-has-for */}
        <label htmlFor="color">{this.props.label}</label>
        <Select
          id={this.props.id}
          options={this.props.options}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.props.value}
        />
        {!!this.props.error &&
          this.props.touched && (
            <div style={{ color: 'red', marginTop: '.5rem' }}>{this.props.error}</div>
        )}
      </div>
    );
  }
}

FormikSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  touched: PropTypes.bool.isRequired,
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  value: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  })).isRequired,
};

FormikSelect.defaultProps = {
  label: '',
};

export default formikEnhancer(Form);
