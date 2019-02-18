import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import VirtualTable from '../../components/VirtualTable';


const columns=[
  {
    width: 200,
    flexGrow: 1.0,
    label: 'Food Item',
    dataKey: 'food'
  },
  {
    width: 120,
    label: 'Amount',
    dataKey: 'amount'
  },
  {
    width: 120,
    label: 'Animal',
    dataKey: 'animal'
  },
  {
    width: 120,
    label: 'Animal Id',
    dataKey: 'animalId'
  },
  {
    width: 120,
    label: 'Location',
    dataKey: 'location'
  },
];

const data = [
  {id: 1, food: 'Cucumber', amount: '1500g', animal: 'Sea Turtle', animalId: 899, location: 'Aquarium'},
  {id: 2, food: 'Apples', amount: '2000g', animal: 'Gorilla', animalId: 765, location: 'Jungle'},
];

class Home extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
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
    const { classes } = this.props;
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
                <MenuItem onClick={this.handleClose}>Print Labels</MenuItem>
                <MenuItem onClick={this.handleClose}>Print Prep Sheets</MenuItem>
                <MenuItem onClick={this.handleClose}>View Diets</MenuItem>
                <MenuItem onClick={this.handleClose}>Produce Order</MenuItem>
                <MenuItem onClick={this.handleClose}>Rodent Order</MenuItem>
                <MenuItem onClick={this.handleClose}>Special Order</MenuItem>

              </Menu>
              <div className={classes.date}>
                {// date component
                }
                <h3>2/11/2019</h3>
              </div>
              <Button variant="contained" className={classes.button} color="secondary">
                Edit Diets
              </Button>
              <Button variant="contained" className={classes.button} color="secondary">
                Edit Foods
              </Button>
            </div>
            <VirtualTable 
            cols={columns}
            height={500}
            rows={data}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;