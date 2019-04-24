export default (theme) => ({
  root: {
    marginLeft: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  item: {
    marginTop: theme.spacing.unit * 8,
  },
  button: {
    margin: theme.spacing.unit,
    marginRight: theme.spacing.unit * 3,
  },
  menuButton: {
    marginRight: theme.spacing.unit * 3,
  },
});
