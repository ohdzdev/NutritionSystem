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
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    speciesId: Yup.string().required('Species is required'),
    current: Yup.bool(),
    tableId: Yup.string().required('Table is Required'),
    noteId: Yup.string().required('Diet name is required'),
    label: Yup.bool(),
    dcId: Yup.string().required('Delivery Container is required'),
    ncPrepares: Yup.bool(),
    groupId: Yup.string().required('Group Diet is required, if no group diet. set to "NONE"'),
    analyzed: Yup.bool(),
  }),
  mapPropsToValues: props => ({
    speciesId: props.speciesId ? String(props.speciesId) : '',
    current: props.current ? props.current === 1 : true, // default true
    tableId: props.tableId ? String(props.tableId) : '',
    noteId: props.noteId ? props.noteId : '',
    label: props.label ? props.label === 1 : true, // default true
    dcId: props.dcId ? String(props.dcId) : '',
    ncPrepares: props.ncPrepares ? props.ncPrepares === 1 : true, // default true
    groupId: props.groupId ? String(props.groupId) : '1',
    analyzed: props.analyzed === 1,
    submitForm: props.submitForm, // jank way to send in the function
  }),
  handleSubmit: (values, { setSubmitting }) => {
    const {
      current, label, ncPrepares, analyzed, submitForm, ...rest
    } = values;
    const payload = {
      current: current ? 1 : 0,
      label: label ? 1 : 0,
      ncPrepares: ncPrepares ? 1 : 0,
      analyzed: analyzed ? 1 : 0,
      ...rest,
    };
    submitForm(payload).then(() => {
      setSubmitting(false);
    }, () => {
      setSubmitting(false);
    });
  },
  displayName: 'MyForm',
});


const Form = props => {
  const {
    values: {
      speciesId,
      current,
      tableId,
      noteId,
      label,
      dcId,
      ncPrepares,
      groupId,
      analyzed,
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

  // const { // DEBUG FORMIK STATE
  //   groupDietCodes, deliveryContainerCodes, tableCodes, speciesCodes, ...debug
  // } = props;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.handleSubmit(e);
      }}
    >
      <Grid container>
        <Grid item xs={12} sm={4} container>
          <Grid item xs={12}>
            <Field
              name="speciesId"
              label="Species ID"
              component={SingleSelect}
              suggestions={props.speciesCodes}
              value={speciesId}
              error={touched.speciesId && Boolean(errors.speciesId)}
              helperText={touched.speciesId ? errors.speciesId : ''}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="noteId"
              name="noteId"
              helperText={touched.noteId ? errors.noteId : ''}
              error={touched.noteId && Boolean(errors.noteId)}
              label="Description"
              value={noteId}
              onChange={change.bind(null, 'noteId')}
              variant="outlined"
              fullWidth
              onFocus={change.bind(null, 'noteId')}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={4} container>
          <Grid item xs={12}>
            <FormCheckbox
              id="current"
              name="current"
              helperText={touched.current ? errors.current : ''}
              error={touched.current && Boolean(errors.current)}
              label="Current Diet"
              value={current}
              onChange={(e) => {
                e.target.value = e.target.checked;
                change.bind(null, 'current')(e);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormCheckbox
              id="ncPrepares"
              name="ncPrepares"
              helperText={touched.ncPrepares ? errors.ncPrepares : ''}
              error={touched.ncPrepares && Boolean(errors.ncPrepares)}
              label="DK Prepares"
              value={ncPrepares}
              onChange={(e) => {
                e.target.value = e.target.checked;
                change.bind(null, 'ncPrepares')(e);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormCheckbox
              id="label"
              name="label"
              helperText={touched.label ? errors.label : ''}
              error={touched.label && Boolean(errors.label)}
              label="Sticker"
              value={label}
              onChange={(e) => {
                e.target.value = e.target.checked;
                change.bind(null, 'label')(e);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormCheckbox
              id="analyzed"
              name="analyzed"
              helperText={touched.analyzed ? errors.analyzed : ''}
              error={touched.analyzed && Boolean(errors.analyzed)}
              label="Diet Analyzed"
              value={analyzed}
              onChange={(e) => {
                e.target.value = e.target.checked;
                change.bind(null, 'analyzed')(e);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={4} container>
          <Grid item xs={12}>
            <Field
              name="tableId"
              label="Prep Location"
              component={SingleSelect}
              suggestions={props.tableCodes}
              value={tableId}
              error={touched.tableId && Boolean(errors.tableId)}
              helperText={touched.tableId ? errors.tableId : ''}
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              name="dcId"
              label="Delivery Container"
              component={SingleSelect}
              suggestions={props.deliveryContainerCodes}
              value={dcId}
              error={touched.dcId && Boolean(errors.dcId)}
              helperText={touched.dcId ? errors.dcId : ''}
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              name="groupId"
              label="Group Diet"
              component={SingleSelect}
              suggestions={props.groupDietCodes}
              value={groupId}
              error={touched.groupId && Boolean(errors.groupId)}
              helperText={touched.groupId ? errors.groupId : ''}
            />
          </Grid>
        </Grid>
      </Grid>
      {isSubmitting &&
        <Fragment>
          <br />
          <LinearProgress />
          <br />
        </Fragment>
      }
      <Grid item xs={12} sm={3} style={{ padding: '10px' }}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={!isValid}
        >
          {props.submitButtonText}
        </Button>
      </Grid>
      {/* <DisplayFormikState {...debug} /> */}
    </form>
  );
};

Form.propTypes = {
  values: PropTypes.shape({
    speciesId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    current: PropTypes.bool.isRequired,
    tableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    noteId: PropTypes.string,
    label: PropTypes.bool.isRequired,
    dcId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    ncPrepares: PropTypes.bool.isRequired,
    groupId: PropTypes.string.isRequired,
    analyzed: PropTypes.bool.isRequired,
  }),
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  speciesCodes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.number,
  })).isRequired,
  tableCodes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.number,
  })).isRequired,
  deliveryContainerCodes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.number,
  })).isRequired,
  groupDietCodes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.number,
  })).isRequired,
  isSubmitting: PropTypes.bool,
  submitButtonText: PropTypes.string,
};

Form.defaultProps = {
  values: {
    speciesId: '',
    current: true,
    tableId: '',
    noteId: '',
    label: true,
    dcId: '',
    ncPrepares: true,
    groupId: '1',
    analyzed: false,
  },
  isSubmitting: false,
  submitButtonText: 'Submit',
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
