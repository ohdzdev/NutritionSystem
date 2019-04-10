import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import NextIcon from '@material-ui/icons/NavigateNext';
import PrevIcon from '@material-ui/icons/NavigateBefore';
import Paper from '@material-ui/core/Paper';
import KitchenView from '../../components/KitchenView';


// import Link from 'next/link';
// import { Button } from '@material-ui/core';

// import { hasAccess, Home, Diet } from '../PageAccess';

import {
  Animals, CaseNotes, DeliveryContainers, DietChanges, DietHistory, DietPlans, Diets, FoodPrepTables, LifeStages, PrepNotes, Species,
} from '../../api';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

export default class extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    token: PropTypes.string,
    classes: PropTypes.object.isRequired,
    FoodPrepTables: PropTypes.array.isRequired,
  };

  static defaultProps = {
    token: '',
  }

  static async getInitialProps({ authToken }) {
    // api helpers on server side
    const serverAnimalAPI = new Animals(authToken);
    const serverCaseNotesAPI = new CaseNotes(authToken);
    const serverDeliverContainersAPI = new DeliveryContainers(authToken);
    const serverDietChangesAPI = new DietChanges(authToken);
    const serverDietHistoryAPI = new DietHistory(authToken);
    const serverDietPlansAPI = new DietPlans(authToken);
    const serverDietsAPI = new Diets(authToken);
    const serverFoodPrepTablesAPI = new FoodPrepTables(authToken);
    const serverLifeStagesAPI = new LifeStages(authToken);
    const serverPrepNotesAPI = new PrepNotes(authToken);
    const serverSpeciesAPI = new Species(authToken);

    const [
      // AllAnimals,
      // AllCaseNotes,
      // AllDeliveryContainers,
      // AllDietChanges,
      // AllDietHistory,
      // AllDietPlans,
      // AllDiets,
      AllFoodPrepTables,
      // AllLifeStages,
      // AllPrepNotes,
      // AllSpecies,
    ] = await Promise.all([
      // serverAnimalAPI.getAnimals(),
      // serverCaseNotesAPI.getCaseNotes(),
      // serverDeliverContainersAPI.getDeliveryContainers(),
      // serverDietChangesAPI.getDietChanges(),
      // serverDietHistoryAPI.getDietHistories(),
      // serverDietPlansAPI.getDietPlans(),
      // serverDietsAPI.getDiets(),
      serverFoodPrepTablesAPI.getFoodPrepTables(),
      // serverLifeStagesAPI.getLifeStages(),
      // serverPrepNotesAPI.getPrepNotes(),
      // serverSpeciesAPI.getSpecies(),
    ]);


    return {
      // Animals: AllAnimals.data,
      // CaseNotes: AllCaseNotes.data,
      // DeliveryContainers: AllDeliveryContainers.data,
      // DietChanges: AllDietChanges.data,
      // DietHistory: AllDietHistory.data,
      // DietPlans: AllDietPlans.data,
      // Diets: AllDiets.data,
      FoodPrepTables: AllFoodPrepTables.data,
      // LifeStages: AllLifeStages.data,
      // PrepNotes: AllPrepNotes.data,
      // Species: AllSpecies.data,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      asdf: props.token, // eslint-disable-line react/no-unused-state
      table: 0,
      labelWidth: 0,
    };
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    // const { role } = this.props.account;
    const { FoodPrepTables } = this.props;
    console.log(this.state.table);

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      >
        <div className={this.props.classes.root}>
          <Fab variant="extended" aria-label="Previous" className={this.props.classes.fab}>
            <PrevIcon className={this.props.classes.extendedIcon} />Prev
          </Fab>
          <FormControl className={this.props.classes.formControl}>
            <InputLabel htmlFor="table-native-simple">Prep Table</InputLabel>
            <NativeSelect
              value={this.state.age}
              onChange={this.handleChange('table')}
              input={<Input name="table" id="table-native-helper" />}
            >
              <option value="" />
              {/* value prop is the table_id of FOOD_PREP_TABLES */
              FoodPrepTables ?
                FoodPrepTables.map((item) => (
                  <option value={item.tableId}>{item.description}</option>
                ))
                : null
          }
            </NativeSelect>
          </FormControl>
          <Fab variant="extended" color="secondary" aria-label="Next" className={this.props.classes.fab}>
            Next<NextIcon className={this.props.classes.extendedIcon} />
          </Fab>
        </div>
        <Paper className={this.props.classes.paper}>
          <KitchenView />
        </Paper>
      </div>
    );
  }
}
