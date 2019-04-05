export default (theme) => ({

  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  row: {
    display: 'flex',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  column: {
    flex: '100%',
  },
});
