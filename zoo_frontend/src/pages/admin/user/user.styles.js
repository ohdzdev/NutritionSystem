import green from '@material-ui/core/colors/green';

export default (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  table: {
    margin: theme.spacing.unit * 3,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  errorText: {
    textAlign: 'center',
  },
  dialogContainer: {
    padding: theme.spacing.unit * 3,
  },
  success: {
    backgroundColor: green[600],
  },
});
