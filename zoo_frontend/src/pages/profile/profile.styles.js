export default (theme) => {
  console.log(theme);
  return {
    container: {
      margin: theme.spacing.unit * 3,
    },
    paper: {
      padding: theme.spacing.unit * 3,
    },
    divider: {
      marginTop: theme.spacing.unit * 3,
      marginBottom: theme.spacing.unit * 3,
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
      marginTop: theme.spacing.unit,
    },
    wrapper: {
      margin: theme.spacing.unit,
      maxWidth: '300px',
      position: 'relative',
    },
    buttonProgress: {
      color: theme.palette.primary.main,
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
  };
};
