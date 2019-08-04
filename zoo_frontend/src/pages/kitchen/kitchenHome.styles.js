export default (theme) => ({
  root: {
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  item: {
    marginTop: theme.spacing(8),
  },
  button: {
    margin: theme.spacing(1),
    marginRight: theme.spacing(3),
  },
  menuButton: {
    marginRight: theme.spacing(3),
  },
});
