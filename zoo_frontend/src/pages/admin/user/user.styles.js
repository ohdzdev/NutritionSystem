import { green } from '@material-ui/core/colors';

export default (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  table: {
    margin: theme.spacing(3),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
  errorText: {
    textAlign: 'center',
  },
  dialogContainer: {
    padding: theme.spacing(3),
  },
  success: {
    backgroundColor: green[600],
  },
});
