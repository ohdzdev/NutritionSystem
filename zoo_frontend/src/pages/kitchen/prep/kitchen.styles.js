export default (theme) => ({

  root: {
    margin: theme.spacing(3),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  row: {
    display: 'flex',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  column: {
    flex: '100%',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  fab: {
    marginLeft: theme.spacing(8),
    marginRight: theme.spacing(8),
    marginTop: theme.spacing(1),

  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
    minHeight: '80vh',
  },
});
