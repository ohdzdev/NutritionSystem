import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  Animals, CaseNotes, DeliveryContainers, DietChanges, DietHistory, DietPlans, Diets, FoodPrepTables, LifeStages, PrepNotes, Species,
} from '../../api';

import DietSelect from './DietSelectDialog';

export default class extends Component {
  static propTypes = {
    // account: PropTypes.object.isRequired,
    // token: PropTypes.string,
    // classes: PropTypes.object.isRequired,
    Diets: PropTypes.arrayOf(PropTypes.object).isRequired,
    DeliveryContainers: PropTypes.arrayOf(PropTypes.object).isRequired,
    Species: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedDiet: PropTypes.object,
  };

  static defaultProps = {
    // token: '',
    selectedDiet: null,
  }

  static async getInitialProps({ query, authToken }) {
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

    // get base data that we know we will need to load
    const [
      AllAnimals,
      AllDeliveryContainers,
      AllDiets,
      AllFoodPrepTables,
      AllLifeStages,
      AllSpecies,
    ] = await Promise.all([
      serverAnimalAPI.getAnimals(),
      serverDeliverContainersAPI.getDeliveryContainers(),
      serverDietsAPI.getDiets(),
      serverFoodPrepTablesAPI.getFoodPrepTables(),
      serverLifeStagesAPI.getLifeStages(),
      serverSpeciesAPI.getSpecies(),
    ]);

    // if the id of a diet is present, then load its necessary information
    if (query.id) {
      const dietId = parseInt(query.id, 10);
      const matchedDiet = AllDiets.data.find((findDiet) => findDiet.dietId === dietId);

      const serverMatchedDietQuery = { where: { dietId } };
      console.log('matched diet', matchedDiet);
      console.log(serverMatchedDietQuery);

      const [
        matchedCaseNotes,
        matchedDietChanges,
        matchedDietHistory,
        matchedDietPlans,
        matchedPrepNotes,
      ] = await Promise.all([
        serverCaseNotesAPI.getCaseNotes(serverMatchedDietQuery),
        serverDietChangesAPI.getDietChanges(serverMatchedDietQuery),
        serverDietHistoryAPI.getDietHistories(serverMatchedDietQuery),
        serverDietPlansAPI.getDietPlans(serverMatchedDietQuery),
        serverPrepNotesAPI.getPrepNotes(serverMatchedDietQuery),
      ]);

      return {
        Animals: AllAnimals.data,
        CaseNotes: matchedCaseNotes.data,
        DeliveryContainers: AllDeliveryContainers.data,
        DietChanges: matchedDietChanges.data,
        DietHistory: matchedDietHistory.data,
        DietPlans: matchedDietPlans.data,
        Diets: AllDiets.data,
        FoodPrepTables: AllFoodPrepTables.data,
        LifeStages: AllLifeStages.data,
        PrepNotes: matchedPrepNotes.data,
        Species: AllSpecies.data,
        selectedDiet: matchedDiet,
      };
    }
    return {
      Animals: AllAnimals.data,
      DeliveryContainers: AllDeliveryContainers.data,
      Diets: AllDiets.data,
      FoodPrepTables: AllFoodPrepTables.data,
      LifeStages: AllLifeStages.data,
      Species: AllSpecies.data,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      dietSelectDialogOpen: true,
      selectedDiet: props.selectedDiet,
    };
  }

  render() {
    console.log(this.props);
    // const { role } = this.props.account;
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >

        <DietSelect
          open={this.state.dietSelectDialogOpen}
          diets={this.props.Diets}
          deliveryContainers={this.props.DeliveryContainers}
          species={this.props.Species}
          onCancel={() => this.setState({ dietSelectDialogOpen: false })}
          onSave={(diet) => this.setState({ selectedDiet: diet, dietSelectDialogOpen: false })}
        />
        <pre>
          {JSON.stringify(this.state.selectedDiet, null, 2)}
        </pre>
      </div>
    );
  }
}
