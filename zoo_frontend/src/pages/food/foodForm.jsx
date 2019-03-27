/* eslint-disable react/jsx-no-bind */
import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Grid, LinearProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withFormik, Field } from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';

import { FormCheckbox, SingleSelect } from '../../components';

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
    costG: Yup.number().nullable(),
    budgetId: Yup.number().nullable(),
    category: Yup.number().nullable(),
    usdaFoodGroupDesc: Yup.number().nullable(),
    dry: Yup.bool().required(),
    meat: Yup.bool().required(),
    preChop: Yup.bool().required(),
    preBag: Yup.bool().required(),
    active: Yup.bool().required(),
  }),
  mapPropsToValues: props => ({
    food: props.food ? props.food : '',
    sciName: props.sciName ? props.sciName : '',
    manufacturerName: props.manufacturerName ? props.manufacturerName : '',
    ohdzName: props.ohdzName ? props.ohdzName : '',
    costG: props.costG ? props.costG : 0,
    budgetId: props.budgetId,
    category: props.category,
    usdaFoodGroupDesc: props.usdaFoodGroupDesc,
    dry: props.dry === 1,
    meat: props.meat === 1,
    preChop: props.preChop === 1,
    preBag: props.preBag === 1,
    active: props.active === 1,
    submitForm: props.submitForm, // jank way to send in the function
  }),
  handleSubmit: (values, { setSubmitting }) => {
    const {
      dry, meat, preChop, preBag, active, submitForm, ...rest
    } = values;
    const payload = {
      dry: dry ? 1 : 0,
      meat: meat ? 1 : 0,
      preChop: preChop ? 1 : 0,
      preBag: preBag ? 1 : 0,
      active: active ? 1 : 0,
      ...rest,
    };
    submitForm(payload).then(() => {
      setSubmitting(false);
    }, () => {
      setSubmitting(false);
    });
  },
  displayName: 'MyForm',
  enableReinitialize: true,
});


const Form = props => {
  const {
    values: {
      sciName, manufacturerName, ohdzName, food, costG, budgetId, category, usdaFoodGroupDesc, dry, meat, preChop, preBag, active,
    },
    errors,
    touched,
    handleChange,
    isValid,
    setFieldTouched,
    isSubmitting,
  } = props;

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
        <Grid item xs={12} md={4} style={{ padding: '10px' }}>
          <TextField
            id="food"
            name="food"
            helperText={touched.food ? errors.food : ''}
            error={touched.food && Boolean(errors.food)}
            label="Food Name"
            value={food}
            onChange={change.bind(null, 'food')}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4} style={{ padding: '10px' }}>
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
        <Grid item xs={12} md={4} style={{ padding: '10px' }}>
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
        <Grid item xs={12} md={4} style={{ padding: '10px' }}>
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
        <Grid item xs={12} md={4} style={{ padding: '10px' }}>
          <TextField
            id="costG"
            name="costG"
            helperText={touched.costG ? errors.costG : ''}
            error={touched.costG && Boolean(errors.costG)}
            label="Cost Per Gram"
            value={costG}
            onChange={change.bind(null, 'costG')}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4} style={{ padding: '10px', alignSelf: 'center' }}>
          <Field name="budgetId" component={SingleSelect} suggestions={props.budgetCodes} defaultValue={budgetId} />
        </Grid>
        <Grid item xs={12} md={4} style={{ padding: '10px', alignSelf: 'center' }}>
          <Field name="category" component={SingleSelect} suggestions={props.foodCategories} defaultValue={category} />
        </Grid>
        <Grid item xs={12} md={4} style={{ padding: '10px' }}>
          <TextField
            id="usdaFoodGroupDesc"
            name="usdaFoodGroupDesc"
            helperText={touched.usdaFoodGroupDesc ? errors.usdaFoodGroupDesc : ''}
            error={touched.usdaFoodGrouDesc && Boolean(errors.usdaFoodGroupDesc)}
            label="USDA Food Group Description"
            value={usdaFoodGroupDesc}
            onChange={change.bind(null, 'usdaFoodGroupDesc')}
            variant="outlined"
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={6} md={2} style={{ padding: '10px' }}>
          <FormCheckbox
            id="dry"
            name="dry"
            helperText={touched.dry ? errors.dry : ''}
            error={touched.active && Boolean(errors.dry)}
            label="Dry"
            value={dry}
            onChange={(e) => {
              e.target.value = e.target.checked;
              change.bind(null, 'dry')(e);
            }}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={2} style={{ padding: '10px' }}>
          <FormCheckbox
            id="meat"
            name="meat"
            helperText={touched.meat ? errors.meat : ''}
            error={touched.active && Boolean(errors.meat)}
            label="Meat"
            value={meat}
            onChange={(e) => {
              e.target.value = e.target.checked;
              change.bind(null, 'meat')(e);
            }}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={2} style={{ padding: '10px' }}>
          <FormCheckbox
            id="preChop"
            name="preChop"
            helperText={touched.preChop ? errors.preChop : ''}
            error={touched.active && Boolean(errors.preChop)}
            label="Pre Chop"
            value={preChop}
            onChange={(e) => {
              e.target.value = e.target.checked;
              change.bind(null, 'preChop')(e);
            }}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={2} style={{ padding: '10px' }}>
          <FormCheckbox
            id="preBag"
            name="preBag"
            helperText={touched.preBag ? errors.preBag : ''}
            error={touched.active && Boolean(errors.preBag)}
            label="Pre Bag"
            value={preBag}
            onChange={(e) => {
              e.target.value = e.target.checked;
              change.bind(null, 'preBag')(e);
            }}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={2} style={{ padding: '10px' }}>
          <FormCheckbox
            id="active"
            name="active"
            helperText={touched.active ? errors.active : ''}
            error={touched.active && Boolean(errors.active)}
            label="Active"
            value={active}
            onChange={(e) => {
              e.target.value = e.target.checked;
              change.bind(null, 'active')(e);
            }}
            variant="outlined"
            fullWidth
          />
        </Grid>
      </Grid>
      {isSubmitting &&
        <Fragment>
          <br />
          <LinearProgress />
          <br />
        </Fragment>
      }
      <Grid item xs={12} md={3} style={{ padding: '10px' }}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={!isValid}
        >
        Submit Food Update
        </Button>
      </Grid>
      {/* <DisplayFormikState {...props} /> */}
    </form>
  );
};

Form.propTypes = {
  values: PropTypes.shape({
    sciName: PropTypes.string,
    manufacturerName: PropTypes.string,
    ohdzName: PropTypes.string,
    food: PropTypes.string.isRequired,
    costG: PropTypes.number,
    budgetId: PropTypes.number,
    category: PropTypes.number,
    usdaFoodGroupDesc: PropTypes.string,
    dry: PropTypes.bool.isRequired,
    meat: PropTypes.bool.isRequired,
    preChop: PropTypes.bool.isRequired,
    preBag: PropTypes.bool.isRequired,
    active: PropTypes.bool.isRequired,
  }),
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  budgetCodes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.number,
  })).isRequired,
  foodCategories: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.number,
  })).isRequired,
  isSubmitting: PropTypes.bool,
};

Form.defaultProps = {
  values: {
    sciName: '',
    manufacturerName: '',
    ohdzName: '',
    food: '',
    costG: 0,
    budgetId: 0,
    category: 0,
    usdaFoodGroupDesc: '',
    dry: false,
    meat: false,
    preChop: false,
    preBag: false,
    active: false,
  },
  isSubmitting: false,
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
