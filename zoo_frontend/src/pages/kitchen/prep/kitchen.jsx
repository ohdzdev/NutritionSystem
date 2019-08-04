import React, { Component } from 'react';
import PropTypes from 'prop-types';

import NextIcon from '@material-ui/icons/NavigateNext';
import PrevIcon from '@material-ui/icons/NavigateBefore';
import {
  Fab, Input, InputLabel, FormControl, NativeSelect, Paper,
} from '@material-ui/core';
import KitchenView from '../../../components/KitchenView';


// import { hasAccess, Home, Diet } from '../PageAccess';

import {
  DeliveryContainers, DietChanges, Diets, FoodPrepTables, PrepNotes, Species,
} from '../../../api';


export default class extends Component {
  static propTypes = {
    // account: PropTypes.object.isRequired,
    token: PropTypes.string,
    classes: PropTypes.object.isRequired,
    FoodPrepTables: PropTypes.array.isRequired,
    date: PropTypes.string.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    PrepDiets: PropTypes.array.isRequired,
    PrepDietsSub: PropTypes.array.isRequired,
  };

  static defaultProps = {
    token: '',
  }

  static async getInitialProps({ query, authToken }) {
    const serverFoodPrepTablesAPI = new FoodPrepTables(authToken);
    const serverDietsAPI = new Diets(authToken);

    try {
      const [
        AllFoodPrepTables,
        AllFoodPrep,
      ] = await Promise.all([
        serverFoodPrepTablesAPI.getFoodPrepTables(),
        serverDietsAPI.getAnimalPrep(query.date), // this.props.date !!!!!!!!!!
      ]);
      return {
        ...query,
        FoodPrepTables: AllFoodPrepTables.data,
        PrepDiets: AllFoodPrep.data.diets,
        PrepDietsSub: AllFoodPrep.data.dietsSub,
      };
    } catch (err) {
      console.error(err);
      return {
        error: true,
        FoodPrepTables: [],
        PrepDiets: [],
        PrepDietsSub: [],
      };
    }
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
    const items = this.props.PrepDietsSub.filter(item => item.diet_id === dietID);
    return items;
  }

  /* Handle table change !! */
  handleChange = name => event => {
    const e = event.target.value;
    this.setState({ [name]: e, currentIndex: 0 });
    this.getDietsData(e).then(() => {
      this.updateState();
    });
  };

  handleNext = () => {
    this.setState((prevState) => ({
      currentIndex: prevState.currentIndex + 1,
    }));
    this.updateState();
  }

  handlePrev = () => {
    this.setState((prevState) => ({
      currentIndex: prevState.currentIndex - 1,
    }));
    this.updateState();
  }

  updateState = () => this.getKitchenData(
    this.state.diets[this.state.currentIndex].speciesId, // speciesID
    this.state.diets[this.state.currentIndex].dietId, // dietID
    this.state.diets[this.state.currentIndex].dcId, // dcID
    this.props.date,
  );

  render() {
    // const { role } = this.props.account;
    // eslint-disable-next-line no-shadow
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
          {this.state.table && this.state.diets && this.state.diets.length > 0 ?
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
