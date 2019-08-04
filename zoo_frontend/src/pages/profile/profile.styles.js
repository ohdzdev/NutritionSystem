export default (theme) => ({
  container: {
    margin: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(3),
  },
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  formControl: {
    maxWidth: '300px',
  },
  submit: {
    maxWidth: '300px',
  },
  wrapper: {
    position: 'relative',
    marginTop: theme.spacing(1),
  },
  buttonProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});
