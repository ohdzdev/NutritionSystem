import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';

import Notifications from '../../../components/Notifications';
import ErrorPage from '../../../components/ErrorPage';

import DataSrcApi from '../../../api/DataSrc';

class Home extends Component {
  /**
   * Server side data retrieval
   */
  static async getInitialProps({ authToken }) {
    const api = new DataSrcApi(authToken);
    try {
      const res = await api.getDataSrc().catch((err) => ({ data: [{ err: true, msg: err }] }));
      return { dataSrc: res.data };
    } catch (err) {
      return {
        dataSrc: [],
        error: true,
        errorMessage: 'Error loading data',
      };
    }
  }
  static propTypes = {
    // account: PropTypes.object.isRequired,
    token: PropTypes.string,
    classes: PropTypes.object.isRequired,
    dataSrc: PropTypes.array.isRequired,
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
      dataSrc: props.dataSrc,
    };
    this.notificationsRef = React.createRef();
  }

  onRowAdd = (newData) => new Promise(async (resolve, reject) => {
    const dataSrcApi = new DataSrcApi(this.props.token);
    // Reject if no short form
    if (!newData.shortForm) {
      this.notificationsRef.current.showNotification('error', 'Please fill out "Short Form".');
      reject();
      return;
    }

    try {
      // Create the dataSrc entry
      await dataSrcApi.createDataSrc(newData);
    } catch (err) {
      reject();
    }

    // Refresh Data
    try {
      const dataSrcRes = await dataSrcApi.getDataSrc();
      this.setState({ dataSrc: dataSrcRes.data });
      resolve();
    } catch (err) {
      reject();
      return;
    }
    resolve();
  })

  onRowUpdate = (newData, oldData) => new Promise(async (resolve, reject) => {
    const dataSrcApi = new DataSrcApi(this.props.token);

    // Determine if we need to update and what to update
    let fieldUpdated = false;
    const updatedFields = {};

    if (newData.shortForm !== oldData.shortForm) {
      fieldUpdated = true;
      updatedFields.shortForm = newData.shortForm;
    }

    if (newData.title !== oldData.title) {
      fieldUpdated = true;
      updatedFields.title = newData.title;
    }

    if (newData.authors !== oldData.authors) {
      fieldUpdated = true;
      updatedFields.authors = newData.authors;
    }

    if (newData.year !== oldData.year) {
      fieldUpdated = true;
      updatedFields.year = newData.year;
    }

    if (fieldUpdated) {
      await dataSrcApi.updateDataSrc(newData.dataSrcId, updatedFields);
    } else {
      reject();
      return;
    }

    // Refresh Data
    try {
      const dataSrcRes = await dataSrcApi.getDataSrc();
      this.setState({ dataSrc: dataSrcRes.data });
      resolve();
    } catch (err) {
      reject();
      return;
    }
    resolve();
  })

  onRowDelete = (oldData) => new Promise(async (resolve, reject) => {
    const dataSrcApi = new DataSrcApi(this.props.token);
    try {
      // Delete the dataSrc
      await dataSrcApi.deleteDataSrc(oldData.dataSrcId);
    } catch (err) {
      reject();
      return;
    }
    // Refresh Data
    try {
      const dataSrcRes = await dataSrcApi.getDataSrc();
      this.setState({ dataSrc: dataSrcRes.data });
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
              pageSize: 10,
              pageSizeOptions: [10, 25, 50, 100],
              exportButton: true,
              emptyRowsWhenPaging: false,
              addRowPosition: 'first',
            }}
            columns={[
              { title: 'Short Form', field: 'shortForm' },
              { title: 'Title', field: 'title' },
              { title: 'Authors', field: 'authors' },
              { title: 'Year', field: 'year' },

            ]}
            editable={{
              onRowAdd: this.onRowAdd,
              onRowUpdate: this.onRowUpdate,
              onRowDelete: this.onRowDelete,
            }}
            data={this.state.dataSrc}
            title="Data Sources"
          />
        </div>
      </div>
    );
  }
}

export default Home;
