import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import ReactToPrint from 'react-to-print';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';

import PrintIcon from '@material-ui/icons/Print';

import FoodAPI from '../../../api/Food';
import DietsAPI from '../../../api/Diets';
import SpeciesAPI from '../../../api/Species';
import DCAPI from '../../../api/DeliveryContainers';

import DietSelectDialog from '../../../components/DietSelectDialog';

import getTotals from '../utils/getTotals';
import usdFormatter from '../utils/usdFormatter';

const titleMap = {
  food: 'Food',
  AvgGPerDay: 'Daily Feed (grams)',
  AvgSourceUnitPerDay: 'Daily Feed (food unit)',
  CostGPerDay: 'Cost',
};

const styleMap = {
  food: '',
  AvgGPerDay: 'rightText',
  AvgSourceUnitPerDay: 'rightText',
  CostGPerDay: 'rightText',
};

// eslint-disable-next-line
export default class DietCostReport extends Component {
  static async getInitialProps({ query, authToken }) {
    const serverFoodAPI = new FoodAPI(authToken);
    const serverDietsAPI = new DietsAPI(authToken);
    const serverSpeciesAPI = new SpeciesAPI(authToken);
    const serverDCAPI = new DCAPI(authToken);

    // get diet cost data
    let dietCostData = null;
    if (query.id) {
      const dietCostRes = await serverFoodAPI.getDietCostReport(query.id);
      dietCostData = dietCostRes.data;
    } else {
      dietCostData = [];
    }

    // get other data incase the user wants to look at other diet cost reports
    const allDietsRes = await serverDietsAPI.getDiets();
    const allSpeciesRes = await serverSpeciesAPI.getSpecies();
    const allDCRes = await serverDCAPI.getDeliveryContainers();

    // find the selectedDiet and selectedSpecies if there was a diet in the query string and set it as selected
    let selectedDiet = {};
    let selectedSpecies = {};
    if (query.id) {
      selectedDiet = allDietsRes.data.find((d) => d.dietId === parseInt(query.id, 10));
      selectedSpecies = allSpeciesRes.data.find((s) => s.speciesId === selectedDiet.speciesId);
    }

    return {
      reportData: dietCostData,
      reportTotals: getTotals(dietCostData),
      initialDiet: query.id ? query.id : null,
      diets: allDietsRes.data,
      species: allSpeciesRes.data,
      deliveryContainers: allDCRes.data,
      selectedDiet,
      selectedSpecies,
    };
  }

  static propTypes = {
    initialDiet: PropTypes.string,
    species: PropTypes.arrayOf(PropTypes.object).isRequired,
    diets: PropTypes.arrayOf(PropTypes.object).isRequired,
    deliveryContainers: PropTypes.arrayOf(PropTypes.object).isRequired,
    api: PropTypes.object.isRequired,
    reportData: PropTypes.arrayOf(PropTypes.object).isRequired,
    reportTotals: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    selectedDiet: PropTypes.object,
    selectedSpecies: PropTypes.object,
  };

  static defaultProps = {
    initialDiet: null,
    selectedDiet: {},
    selectedSpecies: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      dietSelectOpen: !props.initialDiet,
      selectedDiet: props.selectedDiet,
      selectedSpecies: props.selectedSpecies,
      reportData: props.reportData,
      reportTotals: props.reportTotals,
    };

    this.clientFoodAPI = new FoodAPI(props.api.token);

    this.reportRef = createRef();
    this.printer = createRef();
  }

  onSelectDietCancel() {
    this.setState({
      dietSelectOpen: false,
    });
  }

  onSelectDietSelect(diet) {
    const selectedSpecies = this.props.species.find((s) => s.speciesId === diet.speciesId);
    this.setState(
      {
        dietSelectOpen: false,
        selectedDiet: diet,
        selectedSpecies,
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
                  reportTotals: getTotals(results),
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

  print() {
    this.printer.current.handlePrint();
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.buttonContainer}>
          <Button
            onClick={() => this.setState({ dietSelectOpen: true })}
            color="primary"
            variant="contained"
            style={{ marginRight: '10px' }}
          >
            Select Diet
          </Button>
          <Button variant="contained" color="secondary" onClick={() => this.print()}>
            Print
            <PrintIcon />
          </Button>
        </div>
        {this.state.loading && <LinearProgress />}
        {!this.state.loading && (
          <div>
            <ReactToPrint
              ref={this.printer}
              trigger={() => <div style={{ display: 'none' }} />}
              content={() => this.reportRef.current}
              pageStyle={
                '@page { size: auto;  margin: 6% 5%; } @media print { body { -webkit-print-color-adjust: exact; } }'
              }
            />
            <div ref={this.reportRef}>
              <div>
                <Typography variant="h3" color="textSecondary">
                  {this.state.selectedDiet.dietId}
                </Typography>
                <Typography variant="h5" color="textPrimary">
                  Species: {this.state.selectedSpecies.species}
                </Typography>
                <Typography variant="h5" color="textPrimary">
                  Description: {this.state.selectedDiet.noteId}
                </Typography>
              </div>
              <br />
              <Grid container>
                <Grid item xs={12} sm={4} md={4} lg={2}>
                  <table className={classes.totalTable}>
                    <tbody>
                      <tr>
                        <td className={`${classes.td} ${classes.headerTr}`}>
                          <Typography variant="subtitle1">Daily Cost</Typography>
                        </td>
                        <td className={`${classes.rightText} ${classes.td}`}>
                          <Typography>
                            {usdFormatter(this.state.reportTotals.CostGPerDay)}
                          </Typography>
                        </td>
                      </tr>
                      <tr>
                        <td className={` ${classes.td} ${classes.headerTr}`}>
                          <Typography variant="subtitle1">Monthly Cost</Typography>
                        </td>
                        <td className={`${classes.rightText} ${classes.td}`}>
                          <Typography>
                            {usdFormatter(this.state.reportTotals.CostGPerDay * 30)}
                          </Typography>
                        </td>
                      </tr>
                      <tr>
                        <td className={`${classes.td} ${classes.headerTr}`}>
                          <Typography variant="subtitle1">Yearly Cost</Typography>
                        </td>
                        <td className={`${classes.rightText} ${classes.td}`}>
                          <Typography>
                            {usdFormatter(this.state.reportTotals.CostGPerDay * 365)}
                          </Typography>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Grid>
              </Grid>

              <br />
              <br />
              <table className={classes.styledTable}>
                <thead key="header">
                  <tr className={classes.headerTr}>
                    {Object.keys(titleMap).map((key) => (
                      <th key={key} className={classes[styleMap[key]]}>
                        <Typography variant="subtitle1">{titleMap[key]}</Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody key="allTheData">
                  {this.state.reportData.map((row) => {
                    return (
                      <tr key={`${row.diet_id}-${row.food}`} className={classes.tr}>
                        <td className={`${classes.td}`}>
                          <Typography>{row.food}</Typography>
                        </td>
                        <td className={`${classes.rightText} ${classes.td}`}>
                          <Typography>{row.AvgGPerDay} g</Typography>
                        </td>
                        <td className={`${classes.rightText} ${classes.td}`}>
                          <Typography inline>
                            {row.AvgSourceUnitPerDay} {row.unit}
                          </Typography>
                        </td>
                        <td className={`${classes.rightText} ${classes.td}`}>
                          <Typography>{usdFormatter(row.CostGPerDay)}</Typography>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <DietSelectDialog
          open={this.state.dietSelectOpen}
          species={this.props.species}
          deliveryContainers={this.props.deliveryContainers}
          diets={this.props.diets}
          onCancel={(data) => this.onSelectDietCancel(data)}
          onSelect={(data) => this.onSelectDietSelect(data)}
        />
      </div>
    );
  }
}
