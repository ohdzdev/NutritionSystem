import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import Link from 'next/link';
// import { Button } from '@material-ui/core';

// import { hasAccess, Home, Diet } from '../PageAccess';

import {
  Animals, CaseNotes, DeliveryContainers, DietChanges, DietHistory, DietPlans, Diets, FoodPrepTables, LifeStages, PrepNotes, Species,
} from '../../api';

export default class extends Component {
  static propTypes = {
    // account: PropTypes.object.isRequired,
    token: PropTypes.string,
    // classes: PropTypes.object.isRequired,
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
      AllAnimals,
      AllCaseNotes,
      AllDeliveryContainers,
      AllDietChanges,
      AllDietHistory,
      AllDietPlans,
      AllDiets,
      AllFoodPrepTables,
      AllLifeStages,
      AllPrepNotes,
      AllSpecies,
    ] = await Promise.all([
      serverAnimalAPI.getAnimals(),
      serverCaseNotesAPI.getCaseNotes(),
      serverDeliverContainersAPI.getDeliveryContainers(),
      serverDietChangesAPI.getDietChanges(),
      serverDietHistoryAPI.getDietHistories(),
      serverDietPlansAPI.getDietPlans(),
      serverDietsAPI.getDiets(),
      serverFoodPrepTablesAPI.getFoodPrepTables(),
      serverLifeStagesAPI.getLifeStages(),
      serverPrepNotesAPI.getPrepNotes(),
      serverSpeciesAPI.getSpecies(),
    ]);


    return {
      Animals: AllAnimals.data,
      CaseNotes: AllCaseNotes.data,
      DeliveryContainers: AllDeliveryContainers.data,
      DietChanges: AllDietChanges.data,
      DietHistory: AllDietHistory.data,
      DietPlans: AllDietPlans.data,
      Diets: AllDiets.data,
      FoodPrepTables: AllFoodPrepTables.data,
      LifeStages: AllLifeStages.data,
      PrepNotes: AllPrepNotes.data,
      Species: AllSpecies.data,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      asdf: props.token, // eslint-disable-line react/no-unused-state
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
        <div style={{
          justifyContent: 'space-around', alignItems: 'center', display: 'flex',
        }}
        >
          <pre>
            {/* {JSON.stringify(this.props, null, 2)} */}
          </pre>
        </div>
      </div>
    );
  }
}
