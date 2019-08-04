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
  formControl: {
    marginTop: theme.spacing(2),
  },
  saveButton: {
    marginTop: theme.spacing(1),
  },
  dialogContent: { // https://github.com/mui-org/material-ui/issues/7431#issuecomment-414703875
    overflow: 'visible',
  },
  foodBox: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  nutrientAddButton: {
    margin: theme.spacing(1),
  },
});
