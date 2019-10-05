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
  formControl: {
    marginTop: theme.spacing.unit * 2,
  },
  saveButton: {
    marginTop: theme.spacing.unit,
  },
  dialogContent: {
    // https://github.com/mui-org/material-ui/issues/7431#issuecomment-414703875
    overflow: 'visible',
  },
  foodBox: {
    marginBottom: theme.spacing.unit,
    marginTop: theme.spacing.unit,
  },
  nutrientAddButton: {
    margin: theme.spacing.unit,
  },
});
