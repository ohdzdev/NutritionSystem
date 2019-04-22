import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
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
  DeliveryContainers, DietChanges, Diets, FoodPrepTables, PrepNotes, Species,
} from '../../api';

export default class extends Component {
  static propTypes = {
    // account: PropTypes.object.isRequired,
    token: PropTypes.string,
    classes: PropTypes.object.isRequired,
    FoodPrepTables: PropTypes.array.isRequired,
    date: PropTypes.string.isRequired,
    PrepDiets: PropTypes.array.isRequired,
    PrepDietsSub: PropTypes.array.isRequired,
  };

  static defaultProps = {
    token: '',
  }

  static async getInitialProps({ authToken }) {
    const serverFoodPrepTablesAPI = new FoodPrepTables(authToken);
    const serverDietsAPI = new Diets(authToken);

    const [
      AllFoodPrepTables,
      AllFoodPrep,
    ] = await Promise.all([
      serverFoodPrepTablesAPI.getFoodPrepTables(),
      serverDietsAPI.getAnimalPrep('2019-4-21'), // this.props.date !!!!!!!!!!
    ]);

    return {
      FoodPrepTables: AllFoodPrepTables.data,
      PrepDiets: AllFoodPrep.data.diets,
      PrepDietsSub: AllFoodPrep.data.dietsSub,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      table: 0,
      diets: [],
      currentIndex: 0,
      species: '',
      prepNotes: ['none', 'newline?'],
      dc: '',
      dietChanges: ['none'],
      foodPrep: [],
    };

    /* API */
    this.serverDietsAPI = new Diets(this.props.token);
    this.serverSpeciesAPI = new Species(this.props.token);
    this.serverPrepNotesAPI = new PrepNotes(this.props.token);
    this.serverDeliverContainersAPI = new DeliveryContainers(this.props.token);
    this.serverDietChangesAPI = new DietChanges(this.props.token);
  }

  async getDietsData(tableID) {
    const [
      diets,
    ] = await Promise.all([
      this.serverDietsAPI.getDiets({
        where: {
          tableId: tableID,
        },
      }),
    ]);
    this.setState({
      diets: diets.data,
    });
  }

  /* Data to send as props to KitchenView */
  async getKitchenData(speciesID, dietID, dcID) {
    const [
      species,
      prepNotes,
      dc,
      dietChanges,
    ] = await Promise.all([
      this.serverSpeciesAPI.getSpecies({
        where: {
          speciesId: speciesID,
        },
      }),
      this.serverPrepNotesAPI.getPrepNotes({
        where: {
          dietId: dietID,
        },
      }),
      this.serverDeliverContainersAPI.getDeliveryContainers({
        where: {
          dcId: dcID,
        },
      }),
      this.serverDietChangesAPI.getDietChanges({
        where: {
          dietId: dietID,
        },
      }),
    ]);

    this.setState({
      loading: false,
      species: species.data[0].species,
      prepNotes: prepNotes.data,
      dc: dc.data[0].dc,
      dietChanges: dietChanges.data.slice(0, 3),
      foodPrep: this.getPrepFood(dietID),
    });
  }

  /* Returns the food prep for the diet/animal */
  // For entry in dietsSub where diet_id = dietID
  // food, group_amount
  getPrepFood(dietID) {
    console.log(dietID);
    const items = this.props.PrepDietsSub.filter(item => item.diet_id === dietID);
    return items;
  }

  /* Handle table change !! */
  handleChange = name => event => {
    const e = event.target.value;
    this.setState({ [name]: e });
    this.getDietsData(e).then(() => {
      this.updateState();
    });
  };

  handleNext = () => {
    this.setState((prevState) => ({
      currentIndex: prevState.currentIndex + 1,
      loading: true,
    }));
    this.updateState();
  }

  handlePrev = () => {
    this.setState((prevState) => ({
      currentIndex: prevState.currentIndex - 1,
      loading: true,
    }));
    this.updateState();
  }

  updateState = () => this.getKitchenData(
    this.state.diets[this.state.currentIndex].speciesId, // speciesID
    this.state.diets[this.state.currentIndex].dietId, // dietID
    this.state.diets[this.state.currentIndex].dcId, // dcID
    '2019-4-21', // SEND IN DATE HERE
  );

  render() {
    // const { role } = this.props.account;
    const { FoodPrepTables, date } = this.props;

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      >
        <div className={this.props.classes.root}>
          <Fab
            variant="extended"
            aria-label="Previous"
            className={this.props.classes.fab}
            onClick={() => this.handlePrev()}
            disabled={this.state.currentIndex === 0}
          >
            <PrevIcon className={this.props.classes.extendedIcon} />Prev
          </Fab>
          <FormControl className={this.props.classes.formControl}>
            <InputLabel htmlFor="table-native-simple">Prep Table</InputLabel>
            <NativeSelect
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
          <Fab
            variant="extended"
            color="secondary"
            aria-label="Next"
            className={this.props.classes.fab}
            onClick={() => this.handleNext()}
            disabled={this.state.currentIndex + 1 >= this.state.diets.length}

          >
            Next<NextIcon className={this.props.classes.extendedIcon} />
          </Fab>
        </div>
        <Paper className={this.props.classes.paper}>
          {/* Send data based on this.state.table
          1. Use API calls to all fields needed
          2. Props: data object for every field needed
          3. Then KitchenView can just use the index of the array as the page state

          Object:
            noteId: Diets.noteId
            species: Diets.speciesId
            delContainer: Diets.dcId maps to DC.dc
            prepNotes: for each dietId, array of prepNote
            description: sort of in the state rn, grab it
            foods: DIET_PLAN.dietId
            History: DIET_CHANGES.dietId, diet_change_reason
          */}
          {!this.state.loading && this.state.table && this.state.diets && this.state.diets.length > 0 ?
            <KitchenView
              pageLength={this.state.diets.length}
              currentPage={this.state.currentIndex + 1}
              species={this.state.species}
              noteId={this.state.diets[this.state.currentIndex].noteId}
              prepNotes={this.state.prepNotes}
              dc={this.state.dc}
              dietChanges={this.state.dietChanges}
              foodPrep={this.state.foodPrep}
              date={date}
            />
            : null
          }
        </Paper>
      </div>
    );
  }
}
