import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { serialize } from 'uri-js';

import Router from 'next/router';

import {
  Typography,
  Card,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Button,
} from '@material-ui/core';

import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';

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
  Food,
  Units,
  Users,
  Roles as RoleAPI,
  // RoleMappings,
} from '../../api';

import { Notifications, ConfirmationDialog } from '../../components';

import DietSelect from './DietSelectDialog';
import DietPlanChangeDialog from './DietPlanChangeDialog';

import DietHistoryList from './dietHistoryList';
import DietForm from './dietForm';
import PrepNotesForm from './prepNotesForm';
import CaseNotesForm from './CaseNotesForm';
import DietChangeCard from './DietChangeCard';
import DietHistoryTable from './DietHistory';
import CurrentDietTable from './CurrentDiet';
import DietMenu from './DietMenu';
import NutritionistDialog from './NutritionistEmailDialog';
import blankDietPlanJSON from './blankDietPlan.json';


import Roles from '../../static/Roles';

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
    Foods: PropTypes.arrayOf(PropTypes.object).isRequired,
    Units: PropTypes.arrayOf(PropTypes.object).isRequired,
    Users: PropTypes.arrayOf(PropTypes.object).isRequired,
    Nutritionists: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedDiet: PropTypes.object,
    new: PropTypes.bool,

    CaseNotes: PropTypes.arrayOf(PropTypes.object),
    DietChanges: PropTypes.arrayOf(PropTypes.object),
    DietHistory: PropTypes.arrayOf(PropTypes.object),
    DietPlans: PropTypes.arrayOf(PropTypes.object),
    oldDietPlan: PropTypes.arrayOf(PropTypes.object),
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
    oldDietPlan: [],
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
    const serverFoodAPI = new Food(authToken);
    const serverUnitsAPI = new Units(authToken);
    const serverUserAPI = new Users(authToken);
    const serverRolesAPI = new RoleAPI(authToken);
    // const serverRoleMappingsAPI = new RoleMappings(authToken);

    // get base data that we know we will need to load
    const nutritionFilter = { where: { name: 'nutritionist' } };

    const [AllAnimals, AllDeliveryContainers, AllDiets, AllFoodPrepTables, AllLifeStages, AllSpecies, AllSubenclosures, AllFoods, AllUnits, AllUsers, nutritionistRole] = await Promise.all(
      [
        serverAnimalAPI.getAnimals(),
        serverDeliverContainersAPI.getDeliveryContainers(),
        serverDietsAPI.getDiets(),
        serverFoodPrepTablesAPI.getFoodPrepTables(),
        serverLifeStagesAPI.getLifeStages(),
        serverSpeciesAPI.getSpecies(),
        serverSubenclosuresAPI.getSubenclosures(),
        serverFoodAPI.getFood(),
        serverUnitsAPI.getUnits(),
        serverUserAPI.getUsers(),
        serverRolesAPI.getRoles(nutritionFilter),
      ],
    );

    let principals = [];
    let nutritionists = [];
    if (nutritionistRole.data) {
      const filter = {
        where: {
          principalType: 'USER',
        },
      };
      principals = await serverRolesAPI.getPrincipals(nutritionistRole.data[0].id, filter);

      const principalFilter = {
        where: {
          or: principals.data.map((principal) => ({ id: Number(principal.principalId) })),
        },
      };
      nutritionists = await serverUserAPI.getUsers(principalFilter);
    }

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
            Foods: AllFoods.data,
            Units: AllUnits.data,
            Users: AllUsers.data,
            Nutritionists: nutritionists.data,
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
          oldDietPlan: matchedDietPlans.data,
          Diets: AllDiets.data,
          FoodPrepTables: AllFoodPrepTables.data,
          LifeStages: AllLifeStages.data,
          PrepNotes: matchedPrepNotes.data,
          Species: AllSpecies.data,
          Subenclosures: AllSubenclosures.data,
          Foods: AllFoods.data,
          Units: AllUnits.data,
          Users: AllUsers.data,
          selectedDiet: matchedDiet,
          Nutritionists: nutritionists.data,
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
        Foods: AllFoods.data,
        Units: AllUnits.data,
        Users: AllUsers.data,
        new: true,
        Nutritionists: nutritionists.data,
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
      Foods: AllFoods.data,
      Units: AllUnits.data,
      Users: AllUsers.data,
      Nutritionists: nutritionists.data,
    };
  }

  constructor(props) {
    super(props);

    let editDisabled = false;
    if (this.props.account && this.props.account.role) {
      const { role } = this.props.account;
      if (role !== Roles.ADMIN && role !== Roles.NUTRITIONIST && role !== Roles.KITCHENPLUS) {
        editDisabled = true;
      }
    }
    this.state = {
      newDietOpen: props.new, // auto open up new form if from the url
      dietSelectDialogOpen: !props.new && !props.selectedDiet,
      dietDeleteDialogOpen: false,
      Diets: props.Diets, // load Diets into the state to allow us to add a new diet in if created via page
      selectedDiet: props.selectedDiet || null, // if a user has a selected diet from the URL load it here
      dietChangeDialogOpen: false,

      // if diet specific stuff is gathered from URL load it into state so we can change dependent tables etc accordingly
      CaseNotes: props.CaseNotes || [],
      DietChanges: props.DietChanges || [],
      DietHistory: props.DietHistory || [],
      DietPlans: props.DietPlans || [],
      oldDietPlan: props.oldDietPlan || [],
      PrepNotes: props.PrepNotes || [],

      // dropdown selection codes
      speciesCodeOptions: props.Species.map((item) => ({ label: item.species ? item.species : '', value: item.speciesId })),
      deliveryContainerCodeOptions: props.DeliveryContainers.map((item) => ({ label: item.dc ? item.dc : '', value: item.dcId })),
      groupDietCodeOptions: props.Subenclosures.map((item) => ({ label: item.subenclosure ? item.subenclosure : '', value: item.seId })),
      tableCodeOptions: props.FoodPrepTables.map((item) => ({ label: item.description ? item.description : '', value: item.tableId })),

      // dietHistory selections
      DietHistoryOptions: props.DietHistory.filter((item, index) => props.DietHistory.findIndex((el) => el.startId === item.startId) >= index).map((el) => ({
        text: moment(new Date(el.startId)).format('MM-DD-YYYY h:mm A'),
        id: el.startId,
      })).reverse(),

      // diet plan window
      viewCurrentDietPlan: true,
      selectedDietHistories: [],
      numAnimals: props.selectedDiet ? props.selectedDiet.numAnimals : 1,
      pendingChanges: false,

      // diet plan save data
      dietPlanChangeDialogOpen: false, // dietPlan specific changelog window
      dialogChangeNotes: '',

      // DISABLE EDIT
      editDisabled,

      // email dialog
      nutritionistDialog: false,
    };
    this.clientDietAPI = new Diets(props.token);

    this.notificationBar = React.createRef();
    this.currentDietRef = React.createRef();

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

  getUserEmail = (userId) => {
    const found = this.props.Users.find((user) => userId === user.id);
    if (found) {
      return found.email;
    }
    return '';
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

  handleDietUpdate() {
    return new Promise(async (res, rej) => {
      const localSelectedDiet = { ...this.state.selectedDiet };
      Object.assign(localSelectedDiet, this.state.dietUpdatePayload);


      let newDietChange = {};
      const now = new Date();

      let dietChangeAxios = {};
      dietChangeAxios = await this.clientDietChangesAPI.createDietChanges({
        dietChangeDate: now,
        dietChangeReason: this.state.dialogChangeNotes,
        dietId: localSelectedDiet.dietId,
        userId: this.props.account.id,
      }).catch((err) => {
        this.notificationBar.current.showNotification('error', 'Error creating diet change record on server. Please contact system admin');
        console.error(err);
        rej(new Error('Error creating diet change record on server. Please contact system admin'));
      });

      newDietChange = dietChangeAxios.data;

      // add new date and add the current user to be the last one to edit diet.
      localSelectedDiet.date = new Date().toISOString();
      localSelectedDiet.userLogin = this.props.account.id;

      this.clientDietAPI.updateDiets(localSelectedDiet.dietId, localSelectedDiet).then(
        (result) => {
          this.setState((prevState) => ({
            dietUpdatePayload: null, // clear value since it's now updated
            dialogChangeNotes: '', // clear out change notes
            selectedDiet: result.data,
            Diets: prevState.Diets.map((old) => {
              if (old.dietId === result.data.dietId) {
                return result.data;
              }
              return old;
            }),
            DietChanges: [...prevState.DietChanges, newDietChange],
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

  async handleDietDelete() {
    if (this.state.selectedDiet && this.state.selectedDiet.dietId) {
      const dietToDelete = this.state.selectedDiet.dietId;

      // delete related diets then delete main diet
      if (dietToDelete) {
        try {
          await Promise.all([
            this.clientDietHistoryAPI.deleteDietHistoryByDietId(dietToDelete),
            this.clientCaseNotesAPI.deleteCaseNotesByDietId(dietToDelete),
            this.clientDietPlansAPI.deleteDietPlanByDietId(dietToDelete),
            this.clientPrepNotesAPI.deletePrepNotesByDietId(dietToDelete),
            this.clientDietChangesAPI.deleteDietChangesByDietId(dietToDelete),
          ]);
        } catch (error) {
          console.error(error);
          this.notificationBar.current.showNotification('error', 'Error deleting related records of diet. Please contact system admin.');
          return;
        }

        this.clientDietAPI.deleteDiets(dietToDelete).then(
          () => {
            // set window href
            const href = '/diet';
            Router.push(href, href, { shallow: true });

            // clear state
            this.setState((prevState) => ({
              selectedDiet: null,
              Diets: prevState.Diets.filter((diet) => diet.dietId !== dietToDelete),
              // clear related record data since record is deleted.
              CaseNotes: [],
              DietChanges: [],
              DietHistory: [],
              DietHistoryOptions: [],
              DietPlans: [],
              PrepNotes: [],
            }));
          },
          (reject) => {
            console.error(reject);
            this.notificationBar.current.showNotification('error', 'Error deleting diet on server');
          },
        );
      } else {
        this.notificationBar.current.showNotification('error', 'selected diet is missing id');
      }
    }
  }

  handleDietCreate(payload) {
    return new Promise((res, rej) => {
      const localPayload = { ...payload };
      // default values
      localPayload.date = new Date().toISOString();
      localPayload.userLogin = this.props.account.id;
      localPayload.numAnimals = 1;

      this.clientDietAPI.createDiets(localPayload).then(
        (result) => {
          // set window href
          const href = `/diet?id=${result.data.dietId}`;
          Router.push(href, href, { shallow: true });

          // update state
          this.setState((prevState) => ({
            Diets: [...prevState.Diets, result.data],
            newDietOpen: false,
            selectedDiet: { ...result.data },
            numAnimals: result.data.numAnimals,
            // all related record data should be null on a brand new entry
            // this is just in case state wasn't cleared properly
            CaseNotes: [],
            DietChanges: [],
            DietHistory: [],
            DietHistoryOptions: [],
            DietPlans: [],
            PrepNotes: [],
          }));
        },
        (error) => {
          console.error(error);
          this.notificationBar.current.showNotification('error', 'Error creating diet on server.');
          rej();
        },
      );
    });
  }

  handlePrepNotesCreate(payload) {
    return new Promise((res, rej) => {
      const localPayload = { ...payload };
      localPayload.dietId = this.state.selectedDiet.dietId;

      this.clientPrepNotesAPI.createPrepNotes(localPayload).then((result) => {
        this.setState((prevState) => ({
          PrepNotes: [...prevState.PrepNotes, result.data],
        }), () => {
          res();
        });
      }, (error) => {
        console.error(error);
        this.notificationBar.current.showNotification('error', 'Error creating prep note on server.');
        rej();
      });
    });
  }

  handlePrepNoteChange(payload) {
    return new Promise((res, rej) => {
      const localPayload = { ...this.state.selectedPrepNote, ...payload };
      if (!localPayload.prepNoteId) {
        rej();
        this.notificationBar.current.showNotification('error', 'Error updating prep note, id of prep note is missing');
        return;
      }
      this.clientPrepNotesAPI.updatePrepNotes(localPayload.prepNoteId, localPayload).then((result) => {
        this.setState((prevState) => ({
          PrepNotes: prevState.PrepNotes.map((old) => {
            if (old.prepNoteId === result.data.prepNoteId) {
              return result.data;
            }
            return old;
          }),
          selectedPrepNote: null,
        }), () => {
          res();
        });
      }, (error) => {
        console.error(error);
        this.notificationBar.current.showNotification('error', 'Error updating prep note on server.');
        rej();
      });
    });
  }

  async handlePrepNoteDelete(payload) {
    if (payload.prepNoteId) {
      await this.clientPrepNotesAPI.deletePrepNotes(payload.prepNoteId).then(() => {
        this.setState((prevState) => ({
          PrepNotes: prevState.PrepNotes.filter((note) => note.prepNoteId !== payload.prepNoteId),
        }), () => {
          this.notificationBar.current.showNotification('info', 'Delete prep note was successful!');
        });
      }, (err) => {
        console.error(err);
        this.notificationBar.current.showNotification('error', 'Error deleting prep note on server');
      });
    } else {
      this.notificationBar.current.showNotification('error', 'Error deleting prep note. Missing id');
    }
  }

  async handleCaseNoteCreate(payload) {
    return new Promise((res, rej) => {
      const localPayload = { ...payload };
      localPayload.dietId = this.state.selectedDiet.dietId;
      localPayload.caseDate = new Date().toISOString(); // set to now
      localPayload.userId = this.props.account.id;

      this.clientCaseNotesAPI.createCaseNotes(localPayload).then((result) => {
        this.setState((prevState) => ({
          CaseNotes: [...prevState.CaseNotes, result.data],
          selectedCaseNote: null,
        }), () => {
          res();
          this.notificationBar.current.showNotification('info', 'case note created successfully');
        });
      }, (error) => {
        console.error(error);
        this.notificationBar.current.showNotification('error', 'Error creating case note on server.');
        rej();
      });
    });
  }

  async handleCaseNoteChange(payload) {
    return new Promise((res, rej) => {
      const localPayload = { ...this.state.selectedCaseNote, ...payload };
      // update the last touched time to now if description is changed
      localPayload.caseDate = new Date().toISOString();
      localPayload.userId = this.props.account.id;

      if (!localPayload.caseNotesId) {
        rej();
        this.notificationBar.current.showNotification('error', 'Error updating prep note, id of prep note is missing');
        return;
      }
      this.clientCaseNotesAPI.updateCaseNotes(localPayload.caseNotesId, localPayload).then((result) => {
        this.setState((prevState) => ({
          CaseNotes: prevState.CaseNotes.map((old) => {
            if (old.caseNotesId === result.data.caseNotesId) {
              return result.data;
            }
            return old;
          }),
          selectedCaseNote: null,
        }), () => {
          res();
        });
      }, (error) => {
        console.error(error);
        this.notificationBar.current.showNotification('error', 'Error updating prep note on server.');
        rej();
      });
    });
  }

  async handleCaseNoteDelete(payload) {
    if (payload.caseNotesId) {
      await this.clientCaseNotesAPI.deleteCaseNotes(payload.caseNotesId).then(() => {
        this.setState((prevState) => ({
          CaseNotes: prevState.CaseNotes.filter((note) => note.caseNotesId !== payload.caseNotesId),
        }), () => {
          this.notificationBar.current.showNotification('info', 'Delete case note was successful!');
        });
      }, (err) => {
        console.error(err);
        this.notificationBar.current.showNotification('error', 'Error deleting case note on server');
      });
    } else {
      this.notificationBar.current.showNotification('error', 'Error deleting case note. Missing id');
    }
  }

  handleDietPlanUpdate(valuesChanged, id) {
    return new Promise((resolve) => {
      this.setState(prevState => {
        const UpdatedDietPlans = [
          ...prevState.DietPlans.map(item => {
            if (item.id !== id) {
              return item;
            }
            const updatedRow = item;
            Object.assign(updatedRow, valuesChanged);
            return updatedRow;
          }),
        ];
        return { DietPlans: UpdatedDietPlans, pendingChanges: true };
      }, () => {
        resolve();
      });
    });
  }

  handleDietPlanAdd(newRow) {
    return new Promise((resolve) => {
      this.setState((prevState) => ({
        DietPlans: [...prevState.DietPlans, newRow],
        pendingChanges: true,
      }), () => {
        resolve();
      });
    });
  }

  handleDietPlanDelete(oldRow) {
    return new Promise((resolve) => {
      this.setState((prevState) => ({
        DietPlans: [...prevState.DietPlans.filter((item) => item.id !== oldRow.id)],
        pendingChanges: true,
      }), () => {
        resolve();
      });
    });
  }

  handleNutritionistSelect(selected) {
    console.log(selected);
    if (selected) {
      this.setState({
        nutritionistDialog: false,
      }, () => {
        // create mail handler here
        const builtEmailURL = serialize({
          scheme: 'mailto',
          to: [selected.email],
          subject: `Request About Diet: ${this.state.selectedDiet.dietId}`,
          body: `${selected.firstName},\n\n *Message here*\n\n${window.location.href}\n\n- ${this.props.account.firstName} ${this.props.account.lastName}`,
        });
        window.open(builtEmailURL, '_blank'); // new tab
      });
    }
  }

  handleNumAnimalsChange(newNumAnimals) {
    return new Promise((resolve) => {
      this.setState(prevState => ({
        numAnimals: newNumAnimals,
        DietPlans: prevState.DietPlans.map(item => {
          const locItem = { ...item };
          locItem.groupAmount = item.indAmount * newNumAnimals;
          return locItem;
        }),
        pendingChanges: true,
      }), () => {
        resolve();
      });
    });
  }

  handleDietPlanSave() {
    return new Promise(async (resolve, reject) => {
      // is there a change in the number of animals from the previously known selected value
      if (this.state.numAnimals !== this.state.selectedDiet.numAnimals) {
        // update the diet
        const localSelectedDiet = { ...this.state.selectedDiet };
        Object.assign(localSelectedDiet, { numAnimals: this.state.numAnimals });

        // add new date and add the current user to be the last one to edit diet.
        localSelectedDiet.date = new Date().toISOString();
        localSelectedDiet.userLogin = this.props.account.id;

        await new Promise((res, rej) => {
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
              }), () => res());
            },
            (err) => {
              console.error(err);
              rej();
            },
          );
        });
      }

      let newDietChange = {};
      const now = new Date();

      let dietChangeAxios = {};
      dietChangeAxios = await this.clientDietChangesAPI.createDietChanges({
        dietChangeDate: now,
        dietChangeReason: this.state.dialogChangeNotes,
        dietId: this.state.selectedDiet.dietId,
        userId: this.props.account.id,
      }).catch((err) => {
        this.notificationBar.current.showNotification('error', 'Error creating diet change record on server. Please contact system admin');
        console.error(err);
        reject(new Error('Error creating diet change record on server. Please contact system admin'));
      });

      newDietChange = dietChangeAxios.data;
      const { dietChangeId } = newDietChange; // use this to map dietChange to all new dietHistory records

      // from dietPlan create all new dietHistories and link up the dietChange
      const dietHistoryPromises = this.state.oldDietPlan.map((entry) => {
        const {
          id, groupAmount, tempAmount, feeding, ...rest
        } = entry;
        return this.clientDietHistoryAPI.createDietHistories({
          ...rest,
          dietChangeId,
          amount: entry.groupAmount,
          startId: now,
        });
      });

      let newDietHistories = [];

      newDietHistories = await Promise.all(dietHistoryPromises).catch((error) => {
        this.notificationBar.current.showNotification('error', 'Error creating diet history records on server. Please contact system admin.');
        console.error(error);
        reject(new Error('Error creating diet history records on server'));
      });

      // create new whole list of diet history records for every diet plan item
      newDietHistories = newDietHistories.map((i) => i.data);
      const newcombinedDietHistory = [...this.state.DietHistory, ...newDietHistories];

      // from our new list of diet history, create new selection list items
      const newHistoryOptions = newcombinedDietHistory.filter((item, index) => newcombinedDietHistory.findIndex((el) => el.startId === item.startId) >= index).map((el) => ({
        text: moment(new Date(el.startId)).format('MM-DD-YYYY h:mm A'),
        id: el.startId,
      })).reverse();

      // FIND NEW DIET PLANS
      const newDietPlans = this.state.DietPlans.filter((item) => !('id' in item));

      console.log('pending created diet plans', newDietPlans);
      // CREATE NEW DIET PLANS
      const createdDietPlanPromises = newDietPlans.map((entry) => this.clientDietPlansAPI.createDietPlans(Object.assign(blankDietPlanJSON, entry)));
      let createdDietPlans = await Promise.all(createdDietPlanPromises).catch((err) => {
        this.notificationBar.current.showNotification('error', 'Error creating new diet plan records on server. Please contact system admin.');
        console.error(err);
        reject(new Error('Error creating new diet plan records on server.'));
      });
      createdDietPlans = createdDietPlans.map((i) => i.data);

      // FIND EXISTING DIET PLANS
      const updatedDietPlans = this.state.DietPlans.filter((plan) => {
        if (this.state.deletedDietPlans.find((deleted) => deleted.id === plan.id)) {
          return false;
        }
        // new diet plans are harder to match perfectly since they don't have a unique id since they havent been created
        // match against foodId, dietId, and indAmount
        if (newDietPlans.find((newPlan) => newPlan.foodId === plan.foodId && newPlan.dietId === plan.dietId && newPlan.indAmount === plan.indAmount)) {
          return false;
        }
        return true;
      });

      console.log('pending updated diet plans', updatedDietPlans);

      // UDPATE EXISTING DIET PLANS
      let UpdatedDietPlanPromises = [];
      UpdatedDietPlanPromises = updatedDietPlans.map((plan) => this.clientDietPlansAPI.updateDietPlans(plan.id, plan));
      let updatedDietPlanResults = [];
      updatedDietPlanResults = await Promise.all(UpdatedDietPlanPromises).catch((err) => {
        this.notificationBar.current.showNotification('error', 'Error updating existing diet plan records on server. Please contact system admin.');
        console.error(err);
        reject(new Error('Error updating existing diet plan records on server.'));
      });

      updatedDietPlanResults = updatedDietPlanResults.map((i) => i.data);

      console.log('pending delete diet plans', this.state.deletedDietPlans);

      // DELETE REMOVED DIET PLANS
      let deleteDietPlanPromises = [];
      deleteDietPlanPromises = this.state.deletedDietPlans.map((deleted) => this.clientDietPlansAPI.deleteDietPlans(deleted.id));
      await Promise.all(deleteDietPlanPromises).catch((err) => {
        this.notificationBar.current.showNotification('error', 'Error deleting removed diet plan records on server. Please contact system admin.');
        console.error(err);
        reject(new Error('Error deleting removed diet plan records on server.'));
      });

      this.currentDietRef.current.setState({
        isLoading: false,
      }, () => {
        this.setState((prevState) => ({
          DietPlans: [...updatedDietPlanResults, ...createdDietPlans],
          DietChanges: [...prevState.DietChanges, newDietChange],
          DietHistoryOptions: newHistoryOptions,
          DietHistory: newcombinedDietHistory,
          pendingChanges: false,
        }), () => {
          resolve();
        });
      });
    });
  }

  render() {
    console.log(this.props);
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
            </span>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                flexGrow: 1,
                justifyContent: 'flex-end',
              }}
            >
              <DietMenu
                className={classes.dietActionsMenu}
                mail={{
                  enabled: !!this.state.selectedDiet,
                  handler: () => {
                    this.setState({
                      nutritionistDialog: true,
                    });
                  },
                }}
                downloadDiet={{
                  enabled: !!this.state.selectedDiet,
                  handler: async () => {
                    if (this.state.selectedDiet) {
                      const { dietId } = this.state.selectedDiet;
                      await this.clientDietAPI.downloadDietAnalysis(dietId);
                    }
                  },
                }}
                new={{
                  enabled: !this.state.editDisabled,
                  handler: () => {
                    this.setState({
                      newDietOpen: true,
                      selectedDiet: null,
                    }, () => {
                      const href = '/diet?id=new';
                      Router.push(href, href, { shallow: true });
                    });
                  },
                }}
                delete={{
                  enabled: (!!this.state.selectedDiet && !this.state.editDisabled),
                  handler: () => {
                    this.setState({ dietDeleteDialogOpen: true });
                  },
                }}
              />
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
                  this.setState({
                    dietUpdatePayload: { ...payload },
                    dietChangeDialogOpen: true,
                    dialogChangeNotes: '',
                  });
                  return Promise.resolve();
                }
                return this.handleDietCreate(payload);
              }}
              submitButtonText={this.state.newDietOpen ? 'Save New Diet' : 'Save Diet Changes'}
              editDisabled={this.state.editDisabled}
            />
          )}
        </Card>
        <DietSelect
          open={this.state.dietSelectDialogOpen}
          diets={this.state.Diets}
          deliveryContainers={this.props.DeliveryContainers}
          species={this.props.Species}
          onCancel={() => this.setState({ dietSelectDialogOpen: false })}
          onSave={(diet) => this.setState({
            selectedDiet: diet,
            numAnimals: diet.numAnimals,
            dietSelectDialogOpen: false,
          }, () => {
            const href = `/diet?id=${diet.dietId}`;
            Router.push(href, href, { shallow: true });

            // set loading to true, and load all dependent info from API
            this.setState({ loading: true }, () => {
              this.grabDietRelatedRecords(diet).then((results) => {
                this.setState({
                  loading: false,
                  CaseNotes: results.matchedCaseNotes || [],
                  DietChanges: results.matchedDietChanges || [],
                  DietHistory: results.matchedDietHistory || [],
                  DietHistoryOptions: results.matchedDietHistory.filter((item, index) => results.matchedDietHistory.findIndex((el) => el.startId === item.startId) >= index).map((el) => ({
                    text: moment(new Date(el.startId)).format('MM-DD-YYYY h:mm A'),
                    id: el.startId,
                  })).reverse() || [],
                  DietPlans: results.matchedDietPlans || [],
                  oldDietPlan: results.matchedDietPlans || [],
                  PrepNotes: results.matchedPrepNotes || [],
                });
              }, (reason) => {
                console.error(reason);
                this.setState({ loading: false });
              });
            });
          })
          }
        />
        {this.state.loading &&
          <LinearProgress />
        }
        {this.state.selectedDiet && !this.state.loading &&
          <Card className={classes.dietPlanCard}>
            <Grid container>
              <Grid item xs={12} sm={2}>
                <DietHistoryList
                  currentClick={() => {
                    this.setState({ viewCurrentDietPlan: true, currentHistory: null });
                  }}
                  historyClick={(id) => {
                    this.setState((prevState) => ({
                      viewCurrentDietPlan: false,
                      currentHistory: id,
                      selectedDietHistories: prevState.DietHistory.filter((historyRecord) => {
                        if (historyRecord.startId !== id) return false;
                        return true;
                      }),
                    }));
                  }}
                  history={this.state.DietHistoryOptions}
                  currentSelected={this.state.viewCurrentDietPlan}
                  selectedHistory={this.state.currentHistory}
                />
              </Grid>
              <Grid item xs={12} sm={10}>
                {this.state.viewCurrentDietPlan &&
                  <div>
                    <CurrentDietTable
                      ref={this.currentDietRef}
                      allFoods={this.props.Foods}
                      allUnits={this.props.Units}
                      dietPlan={this.state.DietPlans}
                      currentDiet={this.state.selectedDiet}
                      onSave={(deletedDietPlans) => {
                        this.setState({
                          deletedDietPlans,
                          dietPlanChangeDialogOpen: true, // open diet plan specific changelog dialog
                          dialogChangeNotes: '', // reset if not blank from a previous change
                        }, () => {
                          this.currentDietRef.current.setState({ isLoading: false });
                        });
                      }}
                      showNotification={(type, message) => this.notificationBar.current.showNotification(type, message)}
                      numAnimals={this.state.numAnimals}
                      onDietPlanAdd={(newRow) => this.handleDietPlanAdd(newRow)}
                      onDietPlanUpdate={(updatedValues, id) => this.handleDietPlanUpdate(updatedValues, id)}
                      onDietPlanDelete={(oldRow) => this.handleDietPlanDelete(oldRow)}
                      onNumAnimalsChange={(newNumber) => this.handleNumAnimalsChange(newNumber)}
                      pendingChanges={this.state.pendingChanges}
                      editDisabled={this.state.editDisabled}
                    />
                  </div>
                }
                {!this.state.viewCurrentDietPlan &&
                  <div>
                    <DietHistoryTable
                      dietHistory={this.state.selectedDietHistories}
                      allFoods={this.props.Foods}
                      allUnits={this.props.Units}
                      currentHistoryTime={this.state.currentHistory}
                    />
                    {this.state.DietChanges
                      .reverse()
                      .filter((dietChange) => this.state.currentHistory === dietChange.dietChangeDate)
                      .map(value => (
                        <DietChangeCard
                          key={value.dietChangeId}
                          {...value}
                          AllUsers={this.props.Users}
                        />
                      ))}
                  </div>
                }
              </Grid>
            </Grid>
          </Card>
        }
        {this.state.selectedDiet && !this.state.loading &&
          <Grid container>
            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <Typography
                  variant="h4"
                  color="textSecondary"
                >Case Notes
                </Typography>
                <CaseNotesForm
                  {...this.state.selectedCaseNote}
                  submitForm={(payload) => {
                    if (!this.state.selectedCaseNote) {
                      return this.handleCaseNoteCreate(payload);
                    }
                    return this.handleCaseNoteChange(payload);
                  }}
                  submitButtonText={this.state.selectedCaseNote ? 'Submit Case Note Change' : 'Submit New Case Note'}
                  editDisabled={this.state.editDisabled}
                />
                {this.state.selectedCaseNote &&
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={() => { this.setState({ selectedCaseNote: null }); }}
                  >
                    Cancel
                  </Button>
                }

                <List className={classes.overflowList}>
                  {this.state.CaseNotes.map(value => {
                    // helper func
                    const getChangedByNoteText = () => {
                      if (value.userId) {
                        const userEmail = this.getUserEmail(value.userId);
                        if (userEmail) {
                          return ` by ${userEmail}`;
                        }
                      }
                      return '';
                    };

                    return (
                      <div key={value.caseNotesId}>
                        <ListItem>
                          {/* add extra padding around the second action since it's not fully supported */}
                          <ListItemText
                            style={{ paddingRight: '32px' }}
                            secondary={`BCS: ${value.bcs} | ${moment(new Date(value.caseDate)).format('MM-DD-YYYY h:mm A')}${getChangedByNoteText()}`}
                          >
                            {value.caseNote}
                          </ListItemText>
                          <ListItemSecondaryAction>
                            <IconButton
                              onClick={() => {
                                this.setState({ selectedCaseNote: { ...value } });
                              }}
                              disabled={this.state.editDisabled}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                this.handleCaseNoteDelete(value);
                              }}
                              disabled={this.state.editDisabled}
                            >
                              <Delete />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider light />
                      </div>
                    );
                  })}
                </List>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <Typography
                  variant="h4"
                  color="textSecondary"
                >Prep Notes
                </Typography>
                <PrepNotesForm
                  {...this.state.selectedPrepNote}
                  submitForm={(payload) => {
                    if (!this.state.selectedPrepNote) {
                      return this.handlePrepNotesCreate(payload);
                    }
                    return this.handlePrepNoteChange(payload);
                  }}
                  submitButtonText={this.state.selectedPrepNote ? 'Submit Prep Note Change' : 'Submit New Prep Note'}
                  editDisabled={this.state.editDisabled}
                />
                {this.state.selectedPrepNote &&
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={() => { this.setState({ selectedPrepNote: null }); }}
                  >
                    Cancel
                  </Button>
                }

                <List className={classes.overflowList}>
                  {this.state.PrepNotes.map(value => (
                    <div key={value.prepNoteId}>
                      <ListItem>
                        {/* add extra padding around the second action since it's not fully supported */}
                        <ListItemText style={{ paddingRight: '32px' }}>
                          {value.prepNote}
                        </ListItemText>
                        <ListItemSecondaryAction>
                          <IconButton
                            onClick={() => {
                              this.setState({ selectedPrepNote: { ...value } });
                            }}
                            disabled={this.state.editDisabled}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              this.handlePrepNoteDelete(value);
                            }}
                            disabled={this.state.editDisabled}
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      <Divider light />
                    </div>
                  ))}
                </List>
              </Card>
            </Grid>
          </Grid>
        }
        {this.state.selectedDiet && !this.state.loading &&
          <Grid container>
            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <Typography
                  variant="h4"
                  color="textSecondary"
                >Diet Changes
                </Typography>
                <List className={classes.overflowList}>
                  {this.state.DietChanges.reverse().map(value => (
                    <DietChangeCard
                      key={value.dietChangeId}
                      {...value}
                      AllUsers={this.props.Users}
                    />
                  ))}
                </List>
              </Card>
            </Grid>
          </Grid>
        }
        <Notifications ref={this.notificationBar} />
        <ConfirmationDialog
          cancelButtonText="Cancel"
          title="Are you sure you want to delete this diet?"
          message="NOTE: This action will delete all related case notes, prep notes, diet history, diet plan records, and is irreversible."
          open={this.state.dietDeleteDialogOpen}
          onClose={(notCancelled) => {
            this.setState({ dietDeleteDialogOpen: false }, () => {
              if (notCancelled) {
                this.handleDietDelete();
              }
            });
          }}
          okButtonText="OK"
        />
        <DietPlanChangeDialog
          open={this.state.dietPlanChangeDialogOpen}
          defaultChangeNotes={this.state.dialogChangeNotes}
          onCancel={() => {
            this.setState({
              dietPlanChangeDialogOpen: false,
              dialogChangeNotes: '',
            }, () => {
              this.notificationBar.current.showNotification('warning', 'Changes are still pending! Navigating away from page will not save changes.');
              this.currentDietRef.current.setState({
                isLoading: false,
              });
            });
          }}
          onSave={(changeNotes) => {
            this.setState({ dietPlanChangeDialogOpen: false, dialogChangeNotes: changeNotes }, () => {
              this.handleDietPlanSave().catch((err) => {
                console.error(err);
              }).then(() => {
                this.currentDietRef.current.setState({
                  isLoading: false,
                });
              });
            });
          }}
        />
        <DietPlanChangeDialog
          open={this.state.dietChangeDialogOpen}
          defaultChangeNotes={this.state.dialogChangeNotes}
          onCancel={() => {
            this.setState({
              dietChangeDialogOpen: false,
              dialogChangeNotes: '',
            }, () => {
              this.notificationBar.current.showNotification('warning', 'Changes are still pending! Navigating away from page will not save changes.');
            });
          }}
          onSave={(changeNotes) => {
            this.setState({ dietChangeDialogOpen: false, dialogChangeNotes: changeNotes }, () => {
              this.handleDietUpdate().catch((err) => {
                console.error(err);
              });
            });
          }}
        />
        <NutritionistDialog
          open={this.state.nutritionistDialog}
          nutritionistList={this.props.Nutritionists}
          onCancel={() => {
            this.setState({
              nutritionistDialog: false,
            });
          }}
          onSave={(selected) => this.handleNutritionistSelect(selected)}
        />
      </div>
    );
  }
}
