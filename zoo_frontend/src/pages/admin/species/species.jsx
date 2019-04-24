import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';

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
      species: props.species,
    };
    this.notificationsRef = React.createRef();
  }

  onRowAdd = (newData) => new Promise(async (resolve, reject) => {
    const speciesApi = new SpeciesApi(this.props.token);
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
    const speciesApi = new SpeciesApi(this.props.token);

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
    const speciesApi = new SpeciesApi(this.props.token);
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
              addRowPosition: 'first',
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
          />
        </div>
      </div>
    );
  }
}

export default Home;
