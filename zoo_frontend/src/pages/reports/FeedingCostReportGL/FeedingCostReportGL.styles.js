export default (theme) => ({
  container: {
    margin: theme.spacing.unit * 3,
  },
  rightText: {
    textAlign: 'right',
  },

  buttonContainer: {
    padding: '5px',
    display: 'flex',
    justifyContent: 'flex-end',
  },

  table: {
    width: '100%',
    border: '1px solid #8395A6',
    borderCollapse: 'collapse',
  },

  th: {
    padding: '10px 5px',
  },

  td: {
    border: '1px solid #8395A6',
    padding: '5px',
  },

  tr: {
    '&:nth-child(odd)': {
      backgroundColor: '#dee2e6',
    },
  },

  headerTr: {
    backgroundColor: '#8395A6',
    '& th': {
      padding: '10px 5px',
    },
    '& h6': {
      color: '#FAFAFA',
      fontWeight: 500,
    },
  },

  sectionHeaderTr: {
    backgroundColor: '#B5BFCA',
    '& th': {
      padding: '0px 5px',
    },
    '& h6': {
      fontWeight: 500,
    },
  },

  totalTr: {
    backgroundColor: '#B5BFCA',
    '& th': {
      padding: '0px 5px',
    },
    '& h6': {
      fontWeight: 500,
    },
  },
});
