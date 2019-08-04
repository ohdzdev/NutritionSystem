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
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  faIcon: {
    fontSize: 18,
    margin: theme.spacing(0.5),
    // margin if needed
  },
  activeIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
