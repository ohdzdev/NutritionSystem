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
  card: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit,
    overflow: 'visible',
  },
  dietPlanCard: {
    margin: theme.spacing.unit,
    overflow: 'visible',
  },
  dietActionsMenu: {
    alignContent: 'flex-end',
  },
  overflowList: {
    overflow: 'auto',
    maxHeight: 400, // change this for height of list
  },
});
