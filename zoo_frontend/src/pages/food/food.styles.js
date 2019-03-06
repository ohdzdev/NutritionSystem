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
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  faIcon: {
    fontSize: 18,
    // padding if needed (e.g., theme.spacing.unit * 2)
    margin: theme.spacing.unit * 0.5,
    // margin if needed
  },
  activeIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
