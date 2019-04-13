import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Router from 'next/router';

import Button from '@material-ui/core/Button';
import classNames from 'classnames';

import { Typography, Card } from '@material-ui/core';
import {
  Animals,
  CaseNotes,
  DeliveryContainers,
  DietChanges,
  DietHistory,
  DietPlans,
  Diets,
  FoodPrepTables,
  LifeStages,
  PrepNotes,
  Species,
  Subenclosures,
} from '../../api';

import { Notifications } from '../../components';

import DietSelect from './DietSelectDialog';

import DietForm from './dietForm';

export default class extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    token: PropTypes.string,
    classes: PropTypes.object.isRequired,
    Diets: PropTypes.arrayOf(PropTypes.object).isRequired,
    DeliveryContainers: PropTypes.arrayOf(PropTypes.object).isRequired,
    Species: PropTypes.arrayOf(PropTypes.object).isRequired,
    FoodPrepTables: PropTypes.arrayOf(PropTypes.object).isRequired,
    Subenclosures: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedDiet: PropTypes.object,
    new: PropTypes.bool,

    CaseNotes: PropTypes.arrayOf(PropTypes.object),
    DietChanges: PropTypes.arrayOf(PropTypes.object),
    DietHistory: PropTypes.arrayOf(PropTypes.object),
    DietPlans: PropTypes.arrayOf(PropTypes.object),
    PrepNotes: PropTypes.arrayOf(PropTypes.object),

    serverError: PropTypes.string,
  };

  static defaultProps = {
    token: '',
    selectedDiet: null,
    new: false,
    CaseNotes: [],
    DietChanges: [],
    DietHistory: [],
    DietPlans: [],
    PrepNotes: [],

    serverError: '',
  };

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

    const [AllAnimals, AllDeliveryContainers, AllDiets, AllFoodPrepTables, AllLifeStages, AllSpecies, AllSubenclosures] = await Promise.all(
      [
        serverAnimalAPI.getAnimals(),
        serverDeliverContainersAPI.getDeliveryContainers(),
        serverDietsAPI.getDiets(),
        serverFoodPrepTablesAPI.getFoodPrepTables(),
        serverLifeStagesAPI.getLifeStages(),
        serverSpeciesAPI.getSpecies(),
        serverSubenclosuresAPI.getSubenclosures(),
      ],
    );

    // if the id of a diet is present, then load its necessary information
    if (query.id) {
      if (query.id !== 'new') {
        const dietId = parseInt(query.id, 10);
        const matchedDiet = AllDiets.data.find((findDiet) => findDiet.dietId === dietId);

        if (!matchedDiet) {
          return {
            Animals: AllAnimals.data,
            DeliveryContainers: AllDeliveryContainers.data,
            Diets: AllDiets.data,
            FoodPrepTables: AllFoodPrepTables.data,
            LifeStages: AllLifeStages.data,
            Species: AllSpecies.data,
            Subenclosures: AllSubenclosures.data,
            serverError: 'Diet in URL could not be found.',
          };
        }
        const serverMatchedDietQuery = { where: { dietId } };

        const [matchedCaseNotes, matchedDietChanges, matchedDietHistory, matchedDietPlans, matchedPrepNotes] = await Promise.all([
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
        new: true,
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
      newDietOpen: props.new, // auto open up new form if from the url
      dietSelectDialogOpen: !props.new && !props.selectedDiet,
      Diets: props.Diets, // load Diets into the state to allow us to add a new diet in if created via page
      selectedDiet: props.selectedDiet || null, // if a user has a selected diet from the URL load it here

      // if diet specific stuff is gathered from URL load it into state so we can change dependent tables etc accordingly
      CaseNotes: props.CaseNotes || [],
      DietChanges: props.DietChanges || [],
      DietHistory: props.DietHistory || [],
      DietPlans: props.DietPlans || [],
      PrepNotes: props.PrepNotes || [],

      // dropdown selection codes
      speciesCodeOptions: props.Species.map((item) => ({ label: item.species ? item.species : '', value: item.speciesId })),
      deliveryContainerCodeOptions: props.DeliveryContainers.map((item) => ({ label: item.dc ? item.dc : '', value: item.dcId })),
      groupDietCodeOptions: props.Subenclosures.map((item) => ({ label: item.subenclosure ? item.subenclosure : '', value: item.seId })),
      tableCodeOptions: props.FoodPrepTables.map((item) => ({ label: item.description ? item.description : '', value: item.tableId })),
    };
    this.clientDietAPI = new Diets(props.token);

    this.notificationBar = React.createRef();

    this.clientCaseNotesAPI = new CaseNotes(props.token);
    this.clientDietChangesAPI = new DietChanges(props.token);
    this.clientDietHistoryAPI = new DietHistory(props.token);
    this.clientDietPlansAPI = new DietPlans(props.token);
    this.clientPrepNotesAPI = new PrepNotes(props.token);
  }

  componentDidMount() {
    if (this.props.serverError) {
      this.notificationBar.current.showNotification('error', `Error from server: ${this.props.serverError}`);
    }
  }

  grabDietRelatedRecords = async (selected) => {
    if (selected) {
      const { dietId } = selected;
      const serverMatchedDietQuery = { where: { dietId } };

      const [matchedCaseNotes, matchedDietChanges, matchedDietHistory, matchedDietPlans, matchedPrepNotes] = await Promise.all([
        this.clientCaseNotesAPI.getCaseNotes(serverMatchedDietQuery),
        this.clientDietChangesAPI.getDietChanges(serverMatchedDietQuery),
        this.clientDietHistoryAPI.getDietHistories(serverMatchedDietQuery),
        this.clientDietPlansAPI.getDietPlans(serverMatchedDietQuery),
        this.clientPrepNotesAPI.getPrepNotes(serverMatchedDietQuery),
      ]);
      return Promise.resolve({
        matchedCaseNotes: matchedCaseNotes.data,
        matchedDietChanges: matchedDietChanges.data,
        matchedDietHistory: matchedDietHistory.data,
        matchedDietPlans: matchedDietPlans.data,
        matchedPrepNotes: matchedPrepNotes.data,
      });
    }
    return Promise.reject(new Error('selected diet is blank'));
  }

  handleDietUpdate(payload) {
    // eslint-disable-line
    return new Promise((res, rej) => {
      const localSelectedDiet = { ...this.state.selectedDiet };
      Object.assign(localSelectedDiet, payload);

      // add new date and add the current user to be the last one to edit diet.
      localSelectedDiet.date = new Date().toISOString();
      localSelectedDiet.userLogin = this.props.account.id;

      this.clientDietAPI.updateDiets(localSelectedDiet.dietId, localSelectedDiet).then(
        (result) => {
          this.setState((prevState) => ({
            selectedDiet: result.data,
            Diets: prevState.Diets.map((old) => {
              if (old.dietId === result.data.dietId) {
                return result.data;
              }
              return old;
            }),
          }));
          // need to update state here
          res();
        },
        (err) => {
          console.error(err);
          rej();
        },
      );
    });
  }

  handleDietDelete() {
    if (this.state.selectedDiet && this.state.selectedDiet.dietId) {
      const dietToDelete = this.state.selectedDiet.dietId;

      this.clientDietAPI.deleteDiets(dietToDelete).then(
        () => {
          this.setState((prevState) => ({ selectedDiet: null, Diets: prevState.Diets.filter((diet) => diet.dietId !== dietToDelete) }));
        },
        (reject) => {
          console.error(reject);
          this.notificationBar.current.showNotification('error', 'Error deleting diet on server');
        },
      );
    }
  }

  handleDietCreate(payload) {
    return new Promise((res, rej) => {
      const localPayload = { ...payload };
      localPayload.date = new Date().toISOString();
      localPayload.userLogin = this.props.account.id;
      this.clientDietAPI.createDiets(localPayload).then(
        (result) => {
          this.setState(
            (prevState) => ({ Diets: [...prevState.Diets, result.data], newDietOpen: false, selectedDiet: result.data }),
            () => {
              res(); // once state updated, and successfull network call remove loader
            },
          );
        },
        (error) => {
          console.error(error);
          this.notificationBar.current.showNotification('error', 'Error creating diet on server.');
          rej();
        },
      );
    });
  }

  render() {
    console.log(this.props); // TODO remove once page is finished
    const { classes } = this.props;

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
              <Typography inline variant="h3" style={{ paddingRight: this.state.selectedDiet ? '12px' : '0px' }} color="textSecondary">
                {this.state.selectedDiet ? this.state.selectedDiet.dietId : ''}
              </Typography>
              <Button
                onClick={() => this.setState({ dietSelectDialogOpen: true, newDietOpen: false })}
                color="secondary"
                variant="contained"
              >
                Select Diet
              </Button>
              <Button
                onClick={() => {
                  this.setState({
                    newDietOpen: true,
                    selectedDiet: null,
                  }, () => {
                    const href = '/diet?id=new';
                    Router.push(href, href, { shallow: true });
                  });
                }}
                color="secondary"
                variant="outlined"
                className={classes.newDietButton}
              >
                New Diet
              </Button>
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                flexGrow: 1,
                justifyContent: 'flex-end',
              }}
            >
              {this.state.selectedDiet && (
                <Button
                  onClick={() => this.handleDietDelete()}
                  variant="contained"
                  className={classNames(classes.newDietButton, classes.deleteDietButton)}
                >
                  Delete
                </Button>
              )}
            </span>
          </div>
          {(this.state.selectedDiet || this.state.newDietOpen) && (
            <DietForm
              {...this.state.selectedDiet}
              speciesCodes={this.state.speciesCodeOptions}
              tableCodes={this.state.tableCodeOptions}
              deliveryContainerCodes={this.state.deliveryContainerCodeOptions}
              groupDietCodes={this.state.groupDietCodeOptions}
              submitForm={(payload) => {
                if (!this.state.newDietOpen) {
                  return this.handleDietUpdate(payload);
                }
                return this.handleDietCreate(payload);
              }}
              submitButtonText={this.state.newDietOpen ? 'Save New Diet' : 'Save Diet Changes'}
            />
          )}
        </Card>
        <DietSelect
          open={this.state.dietSelectDialogOpen}
          diets={this.state.Diets}
          deliveryContainers={this.props.DeliveryContainers}
          species={this.props.Species}
          onCancel={() => this.setState({ dietSelectDialogOpen: false })}
          onSave={(diet) => this.setState({ selectedDiet: diet, dietSelectDialogOpen: false }, () => {
            const href = `/diet?id=${diet.dietId}`;
            Router.push(href, href, { shallow: true });

            // set loading to true, and load all dependent info from API
            this.setState({ loading: true }, () => {
              this.grabDietRelatedRecords(diet).then((results) => {
                this.setState({
                  loading: false,
                  CaseNotes: results.matchedCaseNotes,
                  DietChanges: results.matchedDietChanges,
                  DietHistory: results.matchedDietHistory,
                  DietPlans: results.matchedDietPlans,
                  PrepNotes: results.matchedPrepNotes,
                });
              }, (reason) => {
                console.error(reason);
                this.setState({ loading: false });
              });
            });
          })
          }
        />
        <Notifications ref={this.notificationBar} />
        <div>{this.state.loading}</div>
        <pre>{JSON.stringify(this.state.DietPlans, null, 2)}</pre>
      </div>
    );
  }
}
