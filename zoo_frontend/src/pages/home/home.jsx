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

import PrintPrepSheets from '../../components/PrintPrepSheets';

import { hasAccess, Diet, Food } from '../PageAccess';

class Home extends Component {
  static propTypes = {
    account: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes, account = {}, token } = this.props;
    const { role = '' } = account;
    const { anchorEl } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.row}>
          <div className={classes.column}>
            <div className={classes.row}>
              <IconButton
                className={classes.menuButton}
                color="inherit"
                aria-label="Menu"
                aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={this.handleClick}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose}

              >
                <MenuItem onClick={this.handleClose}>
                  <ListItemIcon>
                    <Print />
                  </ListItemIcon>
                  Print Labels
                </MenuItem>
                <MenuItem onClick={this.handleClose}>
                  <ListItemIcon>
                    <Print />
                  </ListItemIcon>
                  Print Prep Sheets
                </MenuItem>
                <MenuItem onClick={this.handleClose}>
                  <ListItemIcon>
                    <RemoveRedEye />
                  </ListItemIcon>
                  View Diets
                </MenuItem>
                <MenuItem onClick={this.handleClose}>Produce Order</MenuItem>
                <MenuItem onClick={this.handleClose}>Rodent Order</MenuItem>
                <MenuItem onClick={this.handleClose}>
                  <ListItemIcon>
                    <Star />
                  </ListItemIcon>
                  Special Order
                </MenuItem>

              </Menu>
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

export default Home;
