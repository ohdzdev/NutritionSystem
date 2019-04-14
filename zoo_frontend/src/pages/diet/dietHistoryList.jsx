import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import History from '@material-ui/icons/History';
import PlayArrow from '@material-ui/icons/PlayArrow';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  root: {
    maxWidth: 200,
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.primary.main,
    borderWidth: theme.spacing.unit / 2,
    borderStyle: 'solid',
    overflow: 'auto',
    maxHeight: 400, // change this for height of list
  },
  ListSubheader: {
    backgroundColor: theme.palette.primary.main,
    color: '#FFF',
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});
class NestedList extends React.Component {
  state = {
    open: true,
  };

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  render() {
    const { classes } = this.props;

    return (
      <List
        subheader={<ListSubheader className={classes.ListSubheader} component="div">Diet History</ListSubheader>}
        className={classes.root}
      >
        <ListItem
          button
          onClick={this.props.currentClick}
          selected={this.props.currentSelected}
        >
          <ListItemIcon>
            <PlayArrow />
          </ListItemIcon>
          <ListItemText>Current</ListItemText>
        </ListItem>
        <ListItem button onClick={this.handleClick}>
          <ListItemIcon>
            <History />
          </ListItemIcon>
          <ListItemText primary="History" />
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        {this.props.history &&
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {this.props.history.map((entry) => (
              <ListItem
                key={String(entry.id)}
                button
                className={classes.nested}
                onClick={() => {
                  this.props.historyClick(entry.id);
                }}
                selected={entry.id === this.props.selectedHistory}
              >
                <ListItemText>{entry.text}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Collapse>
        }

      </List>
    );
  }
}

NestedList.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.any.isRequired,
    text: PropTypes.string.isRequired,
  })),
  historyClick: PropTypes.func,
  currentClick: PropTypes.func,
  currentSelected: PropTypes.bool,
  selectedHistory: PropTypes.any,
};

NestedList.defaultProps = {
  history: [
  ],
  currentSelected: false,
  historyClick: () => {},
  currentClick: () => {},
  selectedHistory: '',
};

export default withStyles(styles)(NestedList);
