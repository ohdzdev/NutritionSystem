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
  card: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    overflow: 'visible',
  },
  dietPlanCard: {
    margin: theme.spacing(1),
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
