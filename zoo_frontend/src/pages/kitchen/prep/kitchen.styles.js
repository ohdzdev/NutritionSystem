export default (theme) => ({
  root: {
    position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  row: {
    display: 'flex',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  column: {
    flex: '100%',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  fab: {
    marginTop: theme.spacing.unit,
    alignItems: 'center',
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    minHeight: '80vh',
  },
  footer: {
    height: '10vh',
  }
});
