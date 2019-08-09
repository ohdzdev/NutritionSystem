import React, { Component } from 'react';
import MaterialTable from 'material-table';
import { MuiThemeProvider } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

import LocalStorage from '../../static/LocalStorage';
import Roles from '../../static/Roles';
import { theme } from '../../getPageContext';

import AnimalsAPI from '../../api/Animals';
import LifeStagesAPI from '../../api/LifeStages';

const checkEditable = () => {
  const role = LocalStorage.getRole();
  return role !== Roles.KITCHEN || role !== Roles.KITCHENPLUS;
};

class AnimalTable extends Component {
  static propTypes = {
    dietNumber: PropTypes.any.isRequired,
    apiToken: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.animalAPI = new AnimalsAPI(this.props.apiToken);
    this.lifeStageAPI = new LifeStagesAPI(this.props.apiToken);

    this.state = {
      lifeStageLookup: {},
      animals: [],
    };

    this.loadAnimalTableData();
  }

  async loadAnimalTableData() {
    const dietQuery = { where: { dietId: this.props.dietNumber } };
    const [matchedAnimalsResult, allLifeStagesResult] = await Promise.all([
      this.animalAPI.getAnimals(dietQuery),
      this.lifeStageAPI.getLifeStages(), // grab all life stages for picklist
    ]);

    // pull data out of network requests
    const matchedAnimals = matchedAnimalsResult.data;
    const allLifeStages = allLifeStagesResult.data;

    // prep data for table
    const lifeStageLookup = {};
    allLifeStages.slice(0).reduce((acc, lifeStage) => {
      acc[lifeStage.lifeStageId] = lifeStage.lifeStageName;
      return acc;
    }, lifeStageLookup);

    this.setState({
      animals: matchedAnimals,
      lifeStageLookup,
    });
  }

  updateAnimal(newData, oldData) {
    return new Promise((res, rej) => {
      if (
        parseInt(newData.accessionNum, 10) !== oldData.accessionNum ||
        newData.houseName !== oldData.houseName ||
        newData.lifeStage !== oldData.lifeStage
      ) {
        const animalsIndex = this.state.animals.findIndex((i) => i.animalId === newData.animalId);

        if (animalsIndex !== -1) {
          try {
            this.animalAPI.updateAnimals(newData.animalId, newData).then(
              (result) => {
                this.setState(
                  (prev) => ({
                    animals: [
                      ...prev.animals.slice(0, animalsIndex),
                      result.data,
                      ...prev.animals.slice(animalsIndex + 1),
                    ],
                  }),
                  () => {
                    res();
                  },
                );
                res();
              },
              (reject) => {
                console.warn(reject);
                res();
              },
            );
          } catch (error) {
            console.error(error);
          }
        } else {
          rej();
        }
      }
    });
  }

  createAnimal(animal) {
    return new Promise((res, rej) => {
      if (animal.accessionNum || animal.houseName || animal.lifeStage) {
        const toBeCreatedAnimal = { ...animal };
        toBeCreatedAnimal.dietId = this.props.dietNumber;
        this.animalAPI.createAnimals(toBeCreatedAnimal).then(
          (result) => {
            this.setState(
              (prev) => ({
                animals: [...prev.animals, result.data],
              }),
              () => {
                res();
              },
            );
          },
          (reject) => {
            console.warn(reject);
            rej();
          },
        );
      } else {
        rej();
      }
    });
  }

  deleteAnimal(animal) {
    return new Promise((res, rej) => {
      this.animalAPI.deleteAnimals(animal.animalId).then(
        (result) => {
          if (result.data.count > 0) {
            const animalIndex = this.state.animals.findIndex((i) => i.animalId === animal.animalId);
            if (animalIndex !== -1) {
              this.setState(
                (prev) => {
                  const copyState = { ...prev };
                  copyState.animals.splice(animalIndex, 1);
                  return {
                    animals: copyState.animals,
                  };
                },
                () => {
                  res();
                },
              );
            } else {
              rej();
            }
          }
        },
        (reject) => {
          console.warn(reject);
          rej();
        },
      );
    });
  }

  render() {
    return (
      <>
        <MuiThemeProvider
          theme={{
            ...theme,
            overrides: {
              MuiTableCell: {
                root: {
                  textAlign: 'center',
                  padding: '0px 4px 0px 4px',
                },
                paddingCheckbox: {
                  padding: '0px 2px 0px 2px',
                },
              },
              MuiSelect: {
                select: {
                  maxWidth: '100px',
                },
              },
              MuiIconButton: {
                root: {
                  padding: '5px 5px 5px 5px',
                },
              },
              MuiTableSortLabel: {
                icon: {
                  display: 'none',
                },
              },
              MuiIcon: {
                root: {
                  width: '1em !important',
                },
              },
            },
          }}
        >
          <MaterialTable
            title="Animals"
            columns={[
              {
                title: 'House Name',
                field: 'houseName',
              },
              {
                title: 'Acc #',
                field: 'accessionNum',
                type: 'numeric',
              },
              {
                title: 'Life Stage',
                field: 'lifeStage',
                lookup: this.state.lifeStageLookup,
              },
            ]}
            data={this.state.animals}
            options={{
              pageSize: 5,
              search: false,
              emptyRowsWhenPaging: false,
            }}
            editable={{
              isEditable: checkEditable,
              isDeletable: checkEditable, // only name(a) rows would be deletable
              onRowAdd: (newData) => this.createAnimal(newData),
              onRowUpdate: (newData, oldData) => this.updateAnimal(newData, oldData),
              onRowDelete: (oldData) => this.deleteAnimal(oldData),
            }}
          />
        </MuiThemeProvider>
      </>
    );
  }
}

export default AnimalTable;
