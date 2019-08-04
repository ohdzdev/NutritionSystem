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
    caseNote: Yup.string().required('Note is required'),
    bcs: Yup
      .number('Score must be a number')
      .min(1, 'Must be greater or equal to 1')
      .max(9, 'Must be less than or equal to 9'),
  }),
  mapPropsToValues: props => ({
    caseNote: props.caseNote ? props.caseNote : '',
    bcs: props.bcs ? props.bcs : '',
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
      caseNote,
      bcs,
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
            id="caseNote"
            name="caseNote"
            multiline
            rowsMax="4"
            helperText={touched.caseNote ? errors.caseNote : ''}
            error={touched.caseNote && Boolean(errors.caseNote)}
            label="Description"
            value={caseNote}
            onChange={change.bind(null, 'caseNote')}
            variant="outlined"
            fullWidth
            onFocus={change.bind(null, 'caseNote')}
            style={{ marginTop: '10px' }}
            disabled={editDisabled}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="bcs"
            name="bcs"
            type="number"
            helperText={touched.bcs ? errors.bcs : 'Blank or enter 1-9'}
            error={touched.bcs && Boolean(errors.bcs)}
            label="Body Condition Score"
            value={bcs}
            onChange={change.bind(null, 'bcs')}
            variant="outlined"
            fullWidth
            onFocus={change.bind(null, 'bcs')}
            style={{ marginTop: '15px' }}
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
    caseNote: PropTypes.string,
    bcs: PropTypes.string,
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
    caseNote: '',
    bcs: '',
  },
  isSubmitting: false,
  submitButtonText: 'Submit',
  editDisabled: false,
};

export default formikEnhancer(Form);
