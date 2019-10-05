export default (theme) => ({
  root: {
    marginLeft: theme.spacing.unit * 4,
    marginRight: theme.spacing.unit * 4,
  },
  row: {
    display: 'flex',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  column: {
    flex: '100%',
  },
  button: {
    margin: theme.spacing.unit,
    marginRight: theme.spacing.unit * 3,
  },
  menuButton: {
    marginRight: theme.spacing.unit * 3,
  },
  table: {
    margin: theme.spacing.unit * 3,
  },
});
