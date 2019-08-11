import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Router from 'next/router';

import Fab from '@material-ui/core/Fab';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import NextIcon from '@material-ui/icons/NavigateNext';
import PrevIcon from '@material-ui/icons/NavigateBefore';
import Paper from '@material-ui/core/Paper';
import KitchenView from './KitchenView';

import { Kitchen } from '../../PageAccess';

import {
  DietChanges,
  Diets,
  FoodPrepTables,
  PrepNotes,
} from '../../../api';


export default class extends Component {
  static propTypes = {
    // account: PropTypes.object.isRequired,
    // token: PropTypes.string,
    classes: PropTypes.object.isRequired,
    prepTables: PropTypes.array.isRequired,
    date: PropTypes.string.isRequired,
    prepDiets: PropTypes.array.isRequired,
    prepDietsSub: PropTypes.array.isRequired,
    prepNotes: PropTypes.array.isRequired,
    dietChanges: PropTypes.array.isRequired,
    table: PropTypes.string,
    diet: PropTypes.string,
  };

  static defaultProps = {
    // token: '',
    table: 0,
    diet: 0,
  };

  static async getInitialProps({ query, authToken }) {
    const prepTablesAPI = new FoodPrepTables(authToken);
    const dietsAPI = new Diets(authToken);
    const dietChangesAPI = new DietChanges(authToken);
    const prepNotesAPI = new PrepNotes(authToken);

    try {
      const [prepTables, foodPrep, dietChanges, prepNotes] = await Promise.all([
        prepTablesAPI.getFoodPrepTables(),
        dietsAPI.getAnimalPrep(query.date), // this.props.date !!!!!!!!!!
        dietChangesAPI.getLastDietChanges(3),
        prepNotesAPI.getPrepNotes(),
      ]);
      return {
        ...query,
        prepTables: prepTables.data || [],
        prepDiets: foodPrep.data.diets,
        prepDietsSub: foodPrep.data.dietsSub,
        dietChanges: dietChanges.data.dietChanges,
        prepNotes: prepNotes.data,
      };
    } catch (err) {
      console.error(err);
      return {
        error: true,
        prepTables: [],
        prepDiets: [],
        prepDietsSub: [],
        dietChanges: [],
        prepNotes: [],
      };
    }
  }

  constructor(props) {
    super(props);

    const tables = this.props.prepTables.map((table) => ({
      ...table,
      diets: this.props.prepDiets.filter((diet) => diet.target === table.tableId).map((diet) => ({
        ...diet,
        prepNotes: this.props.prepNotes.filter((prepNote) => prepNote.dietId === diet.diet_id),
        dietSub: this.props.prepDietsSub.filter((dietSub) => dietSub.diet_id === diet.diet_id && dietSub.target === diet.target),
        dietChanges: this.props.dietChanges.filter((dietChange) => dietChange.diet_id === diet.diet_id)
      })),
    }));

    tables.unshift({
      tableId: -1,
      description: "",
      diets: [],
    });

    let tableIndex = tables.findIndex((table) => Number(this.props.table || -1) === table.tableId);

    if(tableIndex === -1) {
      tableIndex = 0;
    }

    let currentIndex = tables[tableIndex].diets.findIndex((diet) => Number(this.props.diet || 0) === diet.diet_id);

    if(currentIndex === -1) {
      currentIndex = 0;
    }

    this.state = {
      tableIndex,
      currentIndex,
      tables,
    };
  }

  /* Handle table change !! */
  handleChange = (event) => {
    const value = Number(event.target.value);
    this.setState(({ tables }) => ({
      tableIndex: tables.findIndex((table) => table.tableId === value),
      currentIndex: 0,
    }), this.updateUrl);
  };

  handleNext = () => {
    this.setState((prevState) => ({
      currentIndex: prevState.currentIndex + 1,
    }), this.updateUrl);
  };

  handlePrev = () => {
    this.setState((prevState) => ({
      currentIndex: prevState.currentIndex - 1,
    }), this.updateUrl);
  };

  updateUrl = () => {
    const table = this.state.tables[this.state.tableIndex];
    
    let route = `${Kitchen.prep.link}?date=${this.props.date}&table=${table.tableId}`

    if(table.diets.length > this.state.currentIndex) {
      route += `&diet=${table.diets[this.state.currentIndex].diet_id}`
    }

    Router.push(route);
  }

  render() {
    // const { role } = this.props.account;
    const { date } = this.props;

    const { tables, tableIndex, currentIndex } = this.state;

    console.log(this.state);

    return (
      <div
        style={{
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
            onClick={this.handlePrev}
            disabled={currentIndex <= 0}
          >
            <PrevIcon className={this.props.classes.extendedIcon} />
            Prev
          </Fab>
          <FormControl className={this.props.classes.formControl}>
            <InputLabel htmlFor="table-native-simple">Prep Table</InputLabel>
            <NativeSelect
              value={tables[tableIndex].tableId}
              onChange={this.handleChange}
              input={<Input name="table" id="table-native-helper" />}
            >
              {
                tables.map((item) => (
                  <option value={item.tableId}>{item.description}</option>
                ))
              }
            </NativeSelect>
          </FormControl>
          <Fab
            variant="extended"
            color="secondary"
            aria-label="Next"
            className={this.props.classes.fab}
            onClick={this.handleNext}
            disabled={currentIndex + 1 >= tables[tableIndex].diets.length}
          >
            Next
            <NextIcon className={this.props.classes.extendedIcon} />
          </Fab>
        </div>
        <Paper className={this.props.classes.paper}>
          {tables[tableIndex] && tables[tableIndex].diets.length > 0 ? (
            <KitchenView
              pageLength={tables[tableIndex].diets.length}
              currentPage={currentIndex + 1}
              species={tables[tableIndex].diets[currentIndex].species}
              noteId={tables[tableIndex].diets[currentIndex].note_id}
              prepNotes={tables[tableIndex].diets[currentIndex].prepNotes}
              dc={tables[tableIndex].diets[currentIndex].dc}
              dietChanges={tables[tableIndex].diets[currentIndex].dietChanges}
              foodPrep={tables[tableIndex].diets[currentIndex].dietSub}
              date={date}
            />
          ) : null}
        </Paper>
      </div>
    );
  }
}
