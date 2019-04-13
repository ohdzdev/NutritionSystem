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
  card: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit,
    overflow: 'visible',
  },
  newDietButton: {
    marginLeft: theme.spacing.unit * 2,
  },
  exportDietButton: {
    marginLeft: theme.spacing.unit * 2,
  },
  deleteDietButton: {
    color: 'white',
    backgroundColor: '#b71c1c',
    '&:hover': {
      backgroundColor: '#e53935',
    },
    alignContent: 'flex-end',
  },
});
