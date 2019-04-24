import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';

import Notifications from '../../../components/Notifications';
import ErrorPage from '../../../components/ErrorPage';

import NutrDefApi from '../../../api/NutrDef';

class Home extends Component {
  /**
   * Server side data retrieval
   */
  static async getInitialProps({ authToken }) {
    const api = new NutrDefApi(authToken);
    try {
      const res = await api.getNutrDef().catch((err) => ({ data: [{ err: true, msg: err }] }));
      return { nutrDef: res.data };
    } catch (err) {
      return {
        nutrDef: [],
        error: true,
        errorMessage: 'Error loading data',
      };
    }
  }
  static propTypes = {
    // account: PropTypes.object.isRequired,
    token: PropTypes.string,
    classes: PropTypes.object.isRequired,
    nutrDef: PropTypes.array.isRequired,
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
      nutrDef: props.nutrDef,
    };
    this.notificationsRef = React.createRef();
  }

  onRowAdd = (newData) => new Promise(async (resolve, reject) => {
    const nutrDefApi = new NutrDefApi(this.props.token);
    // Reject if no short form
    if (!newData.tagname || !newData.units || !newData.nutrDesc || !newData.srOrder) {
      this.notificationsRef.current.showNotification('error', 'Please fill out "Tag Name", "Units", "Description", "SR Order".');
      reject();
      return;
    }

    try {
      // Create the nutrDef entry
      await nutrDefApi.createNutrDef(newData);
    } catch (err) {
      reject();
    }

    // Refresh Data
    try {
      const nutrDefRes = await nutrDefApi.getNutrDef();
      this.setState({ nutrDef: nutrDefRes.data });
      resolve();
    } catch (err) {
      reject();
      return;
    }
    resolve();
  })

  onRowUpdate = (newData, oldData) => new Promise(async (resolve, reject) => {
    const nutrDefApi = new NutrDefApi(this.props.token);

    // Determine if we need to update and what to update
    let fieldUpdated = false;
    const updatedFields = {};

    if (newData.units !== oldData.units) {
      fieldUpdated = true;
      updatedFields.units = newData.units;
    }

    if (newData.tagname !== oldData.tagname) {
      fieldUpdated = true;
      updatedFields.tagname = newData.tagname;
    }

    if (newData.nutrDesc !== oldData.nutrDesc) {
      fieldUpdated = true;
      updatedFields.nutrDesc = newData.nutrDesc;
    }

    if (newData.numDec !== oldData.numDec) {
      fieldUpdated = true;
      updatedFields.numDec = newData.numDec;
    }

    if (newData.srOrder !== oldData.srOrder) {
      fieldUpdated = true;
      updatedFields.srOrder = newData.srOrder;
    }

    if (newData.bgtName !== oldData.bgtName) {
      fieldUpdated = true;
      updatedFields.bgtName = newData.bgtName;
    }

    if (fieldUpdated) {
      await nutrDefApi.updateNutrDef(newData.nutrNo, updatedFields);
    } else {
      reject();
      return;
    }

    // Refresh Data
    try {
      const nutrDefRes = await nutrDefApi.getNutrDef();
      this.setState({ nutrDef: nutrDefRes.data });
      resolve();
    } catch (err) {
      reject();
      return;
    }
    resolve();
  })

  onRowDelete = (oldData) => new Promise(async (resolve, reject) => {
    const nutrDefApi = new NutrDefApi(this.props.token);
    try {
      // Delete the nutrDef
      await nutrDefApi.deleteNutrDef(oldData.nutrNo);
    } catch (err) {
      reject();
      return;
    }
    // Refresh Data
    try {
      const nutrDefRes = await nutrDefApi.getNutrDef();
      this.setState({ nutrDef: nutrDefRes.data });
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
              pageSizeOptions: [10, 50, 200],
              exportButton: true,
              addRowPosition: 'first',
            }}
            columns={[
              { title: 'Tag Name', field: 'tagname' },
              { title: 'Description', field: 'nutrDesc' },
              { title: 'Units', field: 'units' },
              // eslint-disable-next-line object-curly-newline
              { title: 'Num Desc', field: 'numDec', lookup: { 0: 0, 1: 1, 2: 2, 3: 3 } },
              { title: 'SR Order', field: 'srOrder' },
              { title: 'Bgt. Name', field: 'bgtName' },


            ]}
            editable={{
              onRowAdd: this.onRowAdd,
              onRowUpdate: this.onRowUpdate,
              onRowDelete: this.onRowDelete,
            }}
            data={this.state.nutrDef}
            title="Nutrition Definitions"
          />
        </div>
      </div>
    );
  }
}

export default Home;
