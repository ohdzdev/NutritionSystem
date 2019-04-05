import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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

let id = 0;
function createData(unit, food) {
  id += 1;
  return {
    unit, food,
  };
}

const rows = [
  createData('500 g', 'MIXED GREANS'),
  createData('330 g', 'SEASONAL FRUIT'),
];


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
      value: 0,
    };
  }

  handleTabChange = (event, value) => {
    this.setState({ value });
  };


  render() {
    // const { role } = this.props.account;
    const { value } = this.state;

    return (
      <div className={this.props.classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            centered
          >
            {/* value prop is the table_id of FOOD_PREP_TABLES, which is the same as table_code
              These are hardcoded because not all entries in this table are being used. */}
            <Tab label="Big Bag" value={1} />
            <Tab label="Volunteer" value={2} />
            <Tab label="Dome" value={3} />
            <Tab label="Jungle" value={4} />
            <Tab label="Meat" value={5} />
            <Tab label="Daily" value={7} />
          </Tabs>
        </AppBar>

        {/* Showing the same container, just changing the data in it on each tab change */}
        <TabContainer>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ flex: 1 }}>
              <Typography style={{ fontSize: 30 }}>Procupine, Indian Crested</Typography>
              <Typography style={{ fontSize: 22 }}>Abigail</Typography>
              <Typography style={{ fontSize: 20, marginTop: 20 }}>Prep Notes</Typography>
              <div>
                  No shredded carrot.
              </div>
              <div>
                <Typography style={{ fontSize: 20, marginTop: 20 }}>History</Typography>
                <div>
                  date: changes
                </div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ textAlign: 'right' }}>
                <Typography style={{ fontSize: 22 }}>Jungle</Typography>
                <Typography style={{ fontSize: 22 }}>GIBBON</Typography>
              </div>
              <Table style={{ marginTop: 20 }}>
                <TableBody>
                  {rows.map(row => (
                    <TableRow key={row.id}>
                      <TableCell align="left">{row.unit}</TableCell>
                      <TableCell align="left">{row.food}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

          </div>
        </TabContainer>

      </div>
    );
  }
}
