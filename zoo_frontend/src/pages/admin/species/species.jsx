import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button } from '@material-ui/core';
import MaterialTable from 'material-table';
import Edit from '@material-ui/icons/Edit';
import Search from '@material-ui/icons/Search';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import NextPage from '@material-ui/icons/ChevronRight';
import PreviousPage from '@material-ui/icons/ChevronLeft';
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/Delete';
import Check from '@material-ui/icons/Check';
import Clear from '@material-ui/icons/Clear';
import Export from '@material-ui/icons/SaveAlt';
import Filter from '@material-ui/icons/FilterList';
import ViewColumn from '@material-ui/icons/ViewColumn';
import ThirdStateCheck from '@material-ui/icons/Remove';

import Notifications from '../../../components/Notifications';
import ErrorPage from '../../../components/ErrorPage';

import SpeciesApi from '../../../api/Species';

class Home extends Component {
  /**
   * Server side data retrieval
   */
  static async getInitialProps({ authToken }) {
    const api = new SpeciesApi(authToken);
    try {
      const res = await api.getSpecies().catch((err) => ({ data: [{ err: true, msg: err }] }));
      return { species: res.data };
    } catch (err) {
      return {
        species: [],
        error: true,
        errorMessage: 'Error loading data',
      };
    }
  }
  static propTypes = {
    // account: PropTypes.object.isRequired,
    token: PropTypes.string,
    classes: PropTypes.object.isRequired,
    species: PropTypes.array.isRequired,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
  };

  static defaultProps = {
    token: '',
    error: false,
    errorMessage: '',
  }

  constructor(props) {
    super(props);
    this.state = {
      token: props.token, // eslint-disable-line react/no-unused-state
      species: props.species,
    };
    this.notificationsRef = React.createRef();
  }

  onRowAdd = (newData) => new Promise(async (resolve, reject) => {
    const speciesApi = new SpeciesApi(this.state.token);
    // Reject if no species, scientificName
    if (!newData.species || !newData.scientificName) {
      this.notificationsRef.current.showNotification('error', 'Please fill out all of the "Species" and "Scientific Name".');
      reject();
      return;
    }

    try {
      // Create the species entry
      await speciesApi.addSpecies(newData);
    } catch (err) {
      reject();
    }

    // Refresh Data
    try {
      const specRes = await speciesApi.getSpecies();
      this.setState({ species: specRes.data });
      resolve();
    } catch (err) {
      reject();
      return;
    }
    resolve();
  })

  onRowUpdate = (newData, oldData) => new Promise(async (resolve, reject) => {
    const speciesApi = new SpeciesApi(this.state.token);

    // Determine if we need to update and what to update
    let fieldUpdated = false;
    const updatedFields = {};

    if (newData.species !== oldData.species) {
      fieldUpdated = true;
      updatedFields.species = newData.species;
    }

    if (newData.scientificName !== oldData.scientificName) {
      fieldUpdated = true;
      updatedFields.scientificName = newData.scientificName;
    }

    if (newData.category !== oldData.category) {
      fieldUpdated = true;
      updatedFields.category = newData.category;
    }

    if (newData.type !== oldData.type) {
      fieldUpdated = true;
      updatedFields.type = newData.type;
    }

    if (fieldUpdated) {
      await speciesApi.updateSpecies(newData.speciesId, updatedFields);
    } else {
      reject();
      return;
    }

    // Refresh Data
    try {
      const specRes = await speciesApi.getSpecies();
      this.setState({ species: specRes.data });
      resolve();
    } catch (err) {
      reject();
      return;
    }
    resolve();
  })

  onRowDelete = (oldData) => new Promise(async (resolve, reject) => {
    const speciesApi = new SpeciesApi(this.state.token);
    try {
      // Delete the species
      await speciesApi.deleteSpecies(oldData.speciesId);
    } catch (err) {
      reject();
      return;
    }
    // Refresh Data
    try {
      const specRes = await speciesApi.getSpecies();
      this.setState({ species: specRes.data });
      resolve();
    } catch (err) {
      reject();
      return;
    }
    resolve();
  })

  render() {
    if (this.props.error) {
      return (<ErrorPage message={this.props.errorMessage} />);
    }
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Notifications ref={this.notificationsRef} />
        <div className={this.props.classes.table}>
          <MaterialTable
            options={{
              pageSize: 25,
              pageSizeOptions: [25, 100, 800],
              exportButton: true,
            }}
            icons={{
              Add,
              Check,
              Clear,
              Delete,
              DetailPanel: NextPage,
              Edit,
              Export,
              Filter,
              FirstPage,
              LastPage,
              NextPage,
              PreviousPage,
              ResetSearch: Clear,
              Search,
              ThirdStateCheck,
              ViewColumn,
            }}
            columns={[
              { title: 'Species', field: 'species' },
              { title: 'Scientific Name', field: 'scientificName' },
              {
                title: 'Category',
                field: 'category',
              },
              { title: 'Type', field: 'type' },

            ]}
            editable={{
              onRowAdd: this.onRowAdd,
              onRowUpdate: this.onRowUpdate,
              onRowDelete: this.onRowDelete,
            }}
            data={this.state.species}
            title="Species List"
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
      </div>
    );
  }
}

export default Home;
