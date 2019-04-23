import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import { ListItemIcon } from '@material-ui/core';
import { Print, RemoveRedEye, Star } from '@material-ui/icons';
import Link from 'next/link';
import { AgGridReact } from 'ag-grid-react';

// import ag-grid css files
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-material.css';

import PrintPrepSheets from '../../components/PrintPrepSheets';

import { hasAccess, Diet, Food } from '../PageAccess';

class KitchenHome extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, account = {}, token } = this.props;
    const { role = '' } = account;

    return (
      <div className={classes.root}>
        <div className={classes.row}>
          <div className={classes.column}>
            <div className={classes.row}>
              {hasAccess(role, Diet.edit.roles) &&
                <Link href={Diet.edit.link}>
                  <Button variant="contained" className={classes.button} color="secondary">
                  Edit Diets
                  </Button>
                </Link>
              }
              {hasAccess(role, Food.edit.roles) &&
                <Link href={Diet.edit.link}>
                  <Button variant="contained" className={classes.button} color="secondary">
                    Edit Foods
                  </Button>
                </Link>
              }
              {hasAccess(role, Food.nicknames.roles) &&
                <Link href={Food.nicknames.link}>
                  <Button variant="contained" className={classes.button} color="secondary">
                    Edit Food Nicknames
                  </Button>
                </Link>
              }
            </div>
            <div>
              <PrintPrepSheets token={token} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default KitchenHome;
