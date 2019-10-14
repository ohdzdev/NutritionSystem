import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';

import ErrorPage from '../../../components/ErrorPage';
import Notifications from '../../../components/Notifications';

import BudgetIds from '../../../api/BudgetIds';

class Home extends Component {
  static async getInitialProps({ authToken }) {
    const budgetIdsAPI = new BudgetIds(authToken);
    try {
      const budgetRes = await budgetIdsAPI.getBudgetIds();
      return {
        budgetIds: budgetRes.data,
      };
    } catch (err) {
      return {
        budgetIds: [],
        error: true,
        errorMessage: 'Error loading data.',
      };
    }
  }

  static propTypes = {
    // account: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    budgetIds: PropTypes.arrayOf(PropTypes.object).isRequired,
    token: PropTypes.string,
  };

  static defaultProps = {
    error: false,
    errorMessage: '',
    token: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      budgetIds: props.budgetIds,
    };

    this.notificationsRef = React.createRef();
    this.clientBudgetAPI = new BudgetIds(this.props.token);
  }

  onRowAdd = (newData) =>
    new Promise(async (resolve, reject) => {
      // Reject the new user if there is no firstname, lastname, email, role, or location
      if (!newData.budgetCode) {
        this.notificationsRef.current.showNotification(
          'error',
          'Please fill out all of the fields to create a new budget code.',
        );
        reject();
        return;
      }

      try {
        // Create the department
        await this.clientBudgetAPI.createBudgetIds(newData);
      } catch (err) {
        reject();
        return;
      }

      // Refresh data
      try {
        const budgetIds = await this.clientBudgetAPI.getBudgetIds();
        this.setState({ budgetIds: budgetIds.data });
        resolve();
      } catch (err) {
        reject();
        return;
      }

      resolve();
    });

  onRowUpdate = (newData, oldData) =>
    new Promise(async (resolve, reject) => {
      // Determine if we need to update and what to update
      let fieldUpdated = false;
      const updatedFields = {};

      if (
        newData.budgetCode !== oldData.budgetCode ||
        newData.description !== oldData.description
      ) {
        fieldUpdated = true;
        updatedFields.budgetCode = newData.budgetCode;
        updatedFields.description = newData.description;
      }

      if (fieldUpdated) {
        // Update the department with the new information
        await this.clientBudgetAPI.updateBudgetIds(newData.budgetId, updatedFields);
      }

      // Refresh data
      try {
        const budgetIds = await this.clientBudgetAPI.getBudgetIds();
        this.setState({ budgetIds: budgetIds.data });
        resolve();
      } catch (err) {
        reject();
        return;
      }

      resolve();
    });

  onRowDelete = (oldData) =>
    new Promise(async (resolve, reject) => {
      try {
        // Delete the department
        await this.clientBudgetAPI.deleteBudgetIds(oldData.budgetId);
      } catch (err) {
        reject();
        return;
      }

      // Refresh data
      try {
        const budgetIds = await this.clientBudgetAPI.getBudgetIds();
        this.setState({ budgetIds: budgetIds.data });
        resolve();
      } catch (err) {
        reject();
        return;
      }

      resolve();
    });

  render() {
    if (this.props.error) {
      return <ErrorPage message={this.props.errorMessage} />;
    }

    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Notifications ref={this.notificationsRef} />
        <div className={classes.table}>
          <MaterialTable
            columns={[
              { title: 'Budget Code', field: 'budgetCode' },
              { title: 'Description', field: 'description' },
            ]}
            data={this.state.budgetIds}
            title="Budget Codes"
            options={{
              pageSize: 15,
              pageSizeOptions: [15, 30, 45],
              exportButton: true,
              emptyRowsWhenPaging: false,
              addRowPosition: 'first',
            }}
            editable={{
              onRowAdd: this.onRowAdd,
              onRowUpdate: this.onRowUpdate,
              onRowDelete: this.onRowDelete,
            }}
          />
        </div>
      </div>
    );
  }
}

export default Home;
