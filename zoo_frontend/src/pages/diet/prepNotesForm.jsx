/* eslint-disable react/jsx-no-bind */
import React, { Fragment } from 'react';
import {
  Grid, LinearProgress, Button, TextField,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
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
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    prepNote: Yup.string().required('Note is required'),
  }),
  mapPropsToValues: props => ({
    prepNote: props.prepNote ? props.prepNote : '',
    submitForm: props.submitForm, // jank way to send in the function
  }),
  handleSubmit: (values, { setSubmitting }) => {
    const {
      submitForm, ...rest
    } = values;

    submitForm(rest).then(() => {
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
      prepNote,
    },
    errors,
    touched,
    handleChange,
    isValid,
    setFieldTouched,
    isSubmitting,
    editDisabled,
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
      style={{
        paddingTop: '10px',
      }}
      onSubmit={(e) => {
        e.preventDefault();
        props.handleSubmit(e);
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <TextField
            id="prepNote"
            name="prepNote"
            multiline
            rowsMax="4"
            helperText={touched.prepNote ? errors.prepNote : ''}
            error={touched.prepNote && Boolean(errors.prepNote)}
            label="Description"
            value={prepNote}
            onChange={change.bind(null, 'prepNote')}
            variant="outlined"
            fullWidth
            onFocus={change.bind(null, 'prepNote')}
            disabled={editDisabled}
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
      <Grid item xs={12} style={{ paddingTop: '10px', paddingBottom: '10px' }}>
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
      {/* <DisplayFormikState {...props} /> */}
    </form>
  );
};

Form.propTypes = {
  values: PropTypes.shape({
    prepNote: PropTypes.string,
  }),
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  submitButtonText: PropTypes.string,
  editDisabled: PropTypes.bool,
};

Form.defaultProps = {
  values: {
    prepNote: '',
  },
  isSubmitting: false,
  submitButtonText: 'Submit',
  editDisabled: false,
};

export default formikEnhancer(Form);
