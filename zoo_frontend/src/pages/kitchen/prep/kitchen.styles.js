export default (theme) => ({

  root: {
    margin: theme.spacing.unit * 3,
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
    marginLeft: theme.spacing.unit * 8,
    marginRight: theme.spacing.unit * 8,
    marginTop: theme.spacing.unit,

  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    minHeight: '80vh',
  },
});
