import React from 'react';
import propTypes from 'prop-types';

import {
  Dialog, DialogContent, DialogActions, DialogTitle,
} from '@material-ui/core';

import MaterialTable from 'material-table';

import TableColumnHelper from '../../util/TableColumnHelper';

const DietSelectDialog = (props) => {
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


  const preppedColumns = TableColumnHelper([{
    dietId: null,
    noteId: null,
    speciesId: null,
    dcId: null,
  }], [], {
    dietId: 'Id',
    noteId: 'Diet Name',
    speciesId: 'Species',
    dcId: 'Delivery Container',
  });
  preppedColumns[2].lookup = speciesLookup;
  preppedColumns[3].lookup = deliveryContainerLookup;

  return (
    <div>
      {props.open &&
      <Dialog
        open={props.open}
        maxWidth={false}
      >
        <DialogTitle>
          Select Diet
        </DialogTitle>
        <DialogContent>
          <div style={{ width: '80vw' }}>
            <MaterialTable
              data={props.diets}
              columns={preppedColumns}
              options={{
                maxBodyHeight: 500,
                pageSize: props.diets.length,
              }}
            />
          </div>

        </DialogContent>
        <DialogActions />
      </Dialog>
    }
    </div>
  );
};

DietSelectDialog.propTypes = {
  open: propTypes.bool.isRequired,
  diets: propTypes.arrayOf(propTypes.object).isRequired,
  deliveryContainers: propTypes.arrayOf(propTypes.object).isRequired,
  species: propTypes.arrayOf(propTypes.object).isRequired,

};

export default DietSelectDialog;
