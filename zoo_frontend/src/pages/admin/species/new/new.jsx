import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button } from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import Search from '@material-ui/icons/Search';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import NextPage from '@material-ui/icons/ChevronRight';
import PreviousPage from '@material-ui/icons/ChevronLeft';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import MaterialTable from 'material-table';
import { hasAccess, Admin } from '../../../PageAccess';
import SpeciesAPI from '../../../../api/Species';

class Home extends Component {
  /**
   * Server side data retrieval
   */
  static async getInitialProps({ authToken }) {
    const api = new SpeciesAPI(authToken);
    const res = await api.getUsers().catch((err) => ({ data: [{ err: true, msg: err }] }));
    return { species: res.data };
  }
  static propTypes = {
    account: PropTypes.object.isRequired,
    token: PropTypes.string,
    classes: PropTypes.object.isRequired,
    species: PropTypes.array.isRequired,
  };

  static defaultProps = {
    token: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      asdf: props.token, // eslint-disable-line react/no-unused-state
      open: false,
      sciName: '',
      speciesName: '',
    };
  }

  handleClickOpen = (rowData) => {
    this.setState({ speciesName: rowData.species, sciName: rowData.scientificName });
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = (event) => {
    const species = this.state.speciesName.toUpperCase;
    const sciName = this.state.sciName;
    // network call
  }
  handleSpeciesChange = (event) => {
    this.setState({ speciesName: event.target.value });
  }
  handleSciNameChange = (event) => {
    this.setState({ sciName: event.target.value });
  }

  render() {
    const { role } = this.props.account;
    const speciesData = this.props.species;
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{
          justifyContent: 'space-around', alignItems: 'center', display: 'flex',
        }}
        >
          {/* TODO add report link logic here */}
          <Link href="/reports/species">
            <Button className={this.props.classes.button} color="secondary" variant="contained">
              Species Reports
            </Button>
          </Link>
        </div>
        <div className={this.props.classes.table}>
          <MaterialTable
            options={{
              pageSize: 25,
              pageSizeOptions: [25, 100, 800],
            }}
            icons={{
              Search,
              FirstPage,
              LastPage,
              NextPage,
              PreviousPage,
            }}
            columns={[
              { title: 'Species', field: 'species' },
              { title: 'Scientific Name', field: 'scientificName' },
            ]}
            data={speciesData}
            title="Species List"
            actions={[
              {
                icon: Edit,
                tooltip: 'Edit Entry',
                onClick: (event, rowData) => {
                  this.handleClickOpen(rowData);
                  // alert(`You clicked entry ${rowData.speciesId}`); // eslint-disable-line
                },
              },
            ]}
            localization={{
              pagination: {
                labelDisplayedRows: '{from}-{to} of {count}',
                labelRowsPerPage: 'Rows per page:',
                firstAriaLabel: 'First Page',
                firstTooltip: 'First Page',
                previousAriaLabel: 'Previous Page',
                previousTooltip: 'Previous Page',
                nextAriaLabel: 'Next Page',
                nextTooltip: 'Next Page',
                lastAriaLabel: 'Last Page',
                lastTooltip: 'Last Page',
              },
              toolbar: {
                nRowsSelected: '{0} rows(s) selected',
                showColumnsTitle: 'Show Columns',
                showColumnsAriaLabel: 'Show Columns',
                exportTitle: 'Export',
                exportAriaLabel: 'Export',
                exportName: 'Export as CSV',
                searchTooltip: 'Search',
              },
              header: {
                actions: 'Actions',
              },
              body: {
                emptyDataSourceMessage: 'No records to display',
                filterRow: {
                  filterTooltip: 'Filter',
                },
              },
            }}
          />
        </div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit Species</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <TextField
                autoFocus
                margin="dense"
                id="speciesName"
                label="Species"
                fullWidth
                defaultValue={`${this.state.speciesName}`}
              />
              <TextField
                autoFocus
                margin="dense"
                id="sciName"
                label="Scientific Name"
                fullWidth
                defaultValue={`${this.state.sciName}`}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary" type="submit">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Home;
