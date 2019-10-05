import React, { useState, useCallback } from 'react';
import propTypes from 'prop-types';

import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  withTheme,
} from '@material-ui/core';

import MaterialTable from 'material-table';

import TableColumnHelper from '../util/TableColumnHelper';

const applyCellHighlightIfSelected = (data, selected, rowSelected, selectedStyles) => {
  if (rowSelected) {
    if (data.find((item) => item.dietId === selected && item.dietId === rowSelected.dietId)) {
      return selectedStyles;
    }
  }
  return null;
};

const DietSelectDialog = ({ onSelect, ...props }) => {
  // state
  const [selected, setSelected] = useState(props.defaultDiet);

  const handleSelect = useCallback(() => {
    onSelect(selected);
  }, [onSelect, selected]);

  const speciesLookup = {};
  props.species.slice(0).reduce((acc, species) => {
    acc[species.speciesId] = species.species;
    return acc;
  }, speciesLookup);

  const deliveryContainerLookup = {};
  props.deliveryContainers.slice(0).reduce((acc, species) => {
    acc[species.dcId] = species.dc;
    return acc;
  }, deliveryContainerLookup);

  const preppedColumns = TableColumnHelper(
    [
      {
        dietId: null,
        noteId: null,
        speciesId: null,
        dcId: null,
      },
    ],
    [],
    {
      dietId: 'Id',
      noteId: 'Diet Name',
      speciesId: 'Species',
      dcId: 'Delivery Container',
    },
  );
  preppedColumns[2].lookup = speciesLookup;
  preppedColumns[3].lookup = deliveryContainerLookup;

  preppedColumns[0].cellStyle = (rowData) =>
    applyCellHighlightIfSelected(props.diets, rowData, selected, {
      backgroundColor: props.theme.palette.primary.light,
    });

  return (
    <div>
      {props.open && (
        <Dialog open={props.open} maxWidth={false} onClose={props.onCancel}>
          <DialogTitle>Select Diet</DialogTitle>
          <DialogContent>
            <div style={{ width: '85vw' }}>
              <MaterialTable
                title=""
                data={props.diets}
                columns={preppedColumns}
                options={{
                  pageSize: 7,
                  emptyRowsWhenPaging: false,
                }}
                onRowClick={(evt, rowData) => {
                  setSelected({ ...rowData });
                }}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={props.onCancel} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleSelect}
              color="primary"
              disabled={
                selected === null ||
                (props.defaultDiet && selected && props.defaultDiet.dietId === selected.dietId)
              }
            >
              Select
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

DietSelectDialog.propTypes = {
  open: propTypes.bool.isRequired,
  diets: propTypes.arrayOf(propTypes.object).isRequired,
  deliveryContainers: propTypes.arrayOf(propTypes.object).isRequired,
  species: propTypes.arrayOf(propTypes.object).isRequired,
  defaultDiet: propTypes.object,
  onCancel: propTypes.func.isRequired,
  onSelect: propTypes.func.isRequired,
  theme: propTypes.object.isRequired,
};

DietSelectDialog.defaultProps = {
  defaultDiet: null,
};

export default withTheme()(DietSelectDialog);
