import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import classNames from 'classnames';

import { Typography, Card } from '@material-ui/core';
import {
  Animals, CaseNotes, DeliveryContainers, DietChanges, DietHistory, DietPlans, Diets, FoodPrepTables, LifeStages, PrepNotes, Species, Subenclosures,
} from '../../api';

import DietSelect from './DietSelectDialog';

import DietForm from './dietForm';

export default class extends Component {
  static propTypes = {
    // account: PropTypes.object.isRequired,
    // token: PropTypes.string,
    classes: PropTypes.object.isRequired,
    Diets: PropTypes.arrayOf(PropTypes.object).isRequired,
    DeliveryContainers: PropTypes.arrayOf(PropTypes.object).isRequired,
    Species: PropTypes.arrayOf(PropTypes.object).isRequired,
    FoodPrepTables: PropTypes.arrayOf(PropTypes.object).isRequired,
    Subenclosures: PropTypes.arrayOf(PropTypes.object).isRequired,
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
    const serverSubenclosuresAPI = new Subenclosures(authToken);

    // get base data that we know we will need to load
    const [
      AllAnimals,
      AllDeliveryContainers,
      AllDiets,
      AllFoodPrepTables,
      AllLifeStages,
      AllSpecies,
      AllSubenclosures,
    ] = await Promise.all([
      serverAnimalAPI.getAnimals(),
      serverDeliverContainersAPI.getDeliveryContainers(),
      serverDietsAPI.getDiets(),
      serverFoodPrepTablesAPI.getFoodPrepTables(),
      serverLifeStagesAPI.getLifeStages(),
      serverSpeciesAPI.getSpecies(),
      serverSubenclosuresAPI.getSubenclosures(),
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
        Subenclosures: AllSubenclosures.data,
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
      Subenclosures: AllSubenclosures.data,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      dietSelectDialogOpen: !props.selectedDiet,
      selectedDiet: props.selectedDiet,
      speciesCodeOptions: props.Species.map((item) => ({ label: item.species ? item.species : '', value: item.speciesId })),
      deliveryContainerCodeOptions: props.DeliveryContainers.map((item) => ({ label: item.dc ? item.dc : '', value: item.dcId })),
      groupDietCodeOptions: props.Subenclosures.map((item) => ({ label: item.subenclosure ? item.subenclosure : '', value: item.seId })),
      tableCodeOptions: props.FoodPrepTables.map((item) => ({ label: item.description ? item.description : '', value: item.tableId })),
    };
    console.log('state', this.state);
  }

  render() {
    console.log(this.props);
    const { classes } = this.props;
    // const { role } = this.props.account;
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Card className={classes.card}>
          <div style={{ display: 'flex' }}>
            <span style={{ alignItems: 'center', display: 'flex' }}>
              <Typography inline variant="h3" style={{ paddingRight: this.state.selectedDiet ? '12px' : '0px' }} color="textSecondary">{this.state.selectedDiet ? this.state.selectedDiet.dietId : ''}</Typography>
              <Button onClick={() => this.setState({ dietSelectDialogOpen: true })} color="secondary" variant="contained">Select Diet</Button>
              <Button onClick={() => this.setState({ newDiet: true })} color="secondary" variant="outlined" className={classes.newDietButton}>New Diet</Button>
            </span>
            <span style={{
              display: 'flex', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end',
            }}
            >{ this.state.selectedDiet && <Button onClick={() => this.handleDelete()} variant="contained" className={classNames(classes.newDietButton, classes.deleteDietButton)}>Delete</Button>}
            </span>
          </div>
          { this.state.selectedDiet &&
          <DietForm
            {...this.state.selectedDiet}
            speciesCodes={this.state.speciesCodeOptions}
            tableCodes={this.state.tableCodeOptions}
            deliveryContainerCodes={this.state.deliveryContainerCodeOptions}
            groupDietCodes={this.state.groupDietCodeOptions}
            submitForm={(payload) => this.handleDietUpdate(payload)}
            submitButtonText="Save Diet Changes"
          />
          }

        </Card>
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
