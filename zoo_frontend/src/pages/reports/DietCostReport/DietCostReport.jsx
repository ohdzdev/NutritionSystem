import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

import FoodAPI from '../../../api/Food';
import DietsAPI from '../../../api/Diets';
import SpeciesAPI from '../../../api/Species';
import DCAPI from '../../../api/DeliveryContainers';

import DietSelectDialog from '../../../components/DietSelectDialog';

// eslint-disable-next-line
export default class DietCostReport extends Component {
  static async getInitialProps({ query, authToken }) {
    const serverFoodAPI = new FoodAPI(authToken);
    const serverDietsAPI = new DietsAPI(authToken);
    const serverSpeciesAPI = new SpeciesAPI(authToken);
    const serverDCAPI = new DCAPI(authToken);

    // get diet cost data
    let dietCostRes = null;
    if (query.id) {
      dietCostRes = await serverFoodAPI.getDietCostReport(query.id);
    } else {
      dietCostRes = await serverFoodAPI.getDietCostReport();
    }

    // get other data incase the user wants to look at other diet cost reports
    const allDietsRes = await serverDietsAPI.getDiets();
    const allSpeciesRes = await serverSpeciesAPI.getSpecies();
    const allDCRes = await serverDCAPI.getDeliveryContainers();

    return {
      reportData: dietCostRes.data,
      initialDiet: query.id ? query.id : null,
      diets: allDietsRes.data,
      species: allSpeciesRes.data,
      deliveryContainers: allDCRes.data,
    };
  }

  static propTypes = {
    initialDiet: PropTypes.string,
    species: PropTypes.arrayOf(PropTypes.object).isRequired,
    diets: PropTypes.arrayOf(PropTypes.object).isRequired,
    deliveryContainers: PropTypes.arrayOf(PropTypes.object).isRequired,
    api: PropTypes.object.isRequired,
    reportData: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  static defaultProps = {
    initialDiet: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      dietSelectOpen: !props.initialDiet,
      reportData: props.reportData,
    };

    this.clientFoodAPI = new FoodAPI(props.api.token);
  }

  onSelectDietCancel() {
    this.setState({
      dietSelectOpen: false,
    });
  }

  onSelectDietSelect(diet) {
    this.setState(
      {
        dietSelectOpen: false,
        selectedDiet: diet,
      },
      () => {
        const href = `/reports/diet-cost-report?id=${diet.dietId}`;
        Router.push(href, href, { shallow: true });

        this.setState(
          {
            loading: true,
          },
          () => {
            this.getDietCostReportData(diet).then(
              (results) => {
                this.setState({
                  loading: false,
                  reportData: results,
                });
              },
              (errReason) => {
                console.error(errReason);
                this.setState({ loading: false });
              },
            );
          },
        );
      },
    );
  }

  getDietCostReportData(diet) {
    return new Promise(async (res, rej) => {
      try {
        const rowsRes = await this.clientFoodAPI.getDietCostReport(diet.dietId);
        res(rowsRes.data);
      } catch (error) {
        rej(error);
      }
    });
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <Button
          onClick={() => this.setState({ dietSelectOpen: true })}
          color="secondary"
          variant="contained"
        >
          Select Diet
        </Button>
        <DietSelectDialog
          open={this.state.dietSelectOpen}
          species={this.props.species}
          deliveryContainers={this.props.deliveryContainers}
          diets={this.props.diets}
          onCancel={(data) => this.onSelectDietCancel(data)}
          onSelect={(data) => this.onSelectDietSelect(data)}
        />
        {this.state.loading && <LinearProgress />}
        {!this.state.loading && <div>{JSON.stringify(this.state.reportData, null, 2)}</div>}
      </div>
    );
  }
}
