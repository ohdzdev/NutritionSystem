export default (theme) => ({
  root: {
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
  },
  row: {
    display: 'flex',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  column: {
    flex: '100%',
  },
  button: {
    margin: theme.spacing(1),
    marginRight: theme.spacing(3),
  },
  menuButton: {
    marginRight: theme.spacing(3),
  },
  table: {
    margin: theme.spacing(3),
  },
});
