import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
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

import { theme } from '../../getPageContext';

const styles = t => ({
  root: {
    backgroundColor: t.palette.background.paper,
    borderColor: t.palette.primary.main,
    borderWidth: t.spacing(0.5),
    borderStyle: 'solid',
    overflow: 'auto',
    maxHeight: 400, // change this for height of list
    borderRadius: `${t.spacing(0.5)}px 0px 0px 0px`,
  },
  ListSubheader: {
    backgroundColor: t.palette.primary.main,
    color: '#FFF',
  },
  nested: {
    paddingLeft: t.spacing(2),
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
      <MuiThemeProvider theme={{
        ...theme,
        overrides: {
          MuiListItem: {
            gutters: {
              paddingLeft: theme.spacing(1),
              paddingRight: theme.spacing(0.5),
            },
          },
          MuiListItemIcon: {
            root: {
              marginRight: '0px',
            },
          },
          MuiListItemText: {
            root: {
              paddingLeft: theme.spacing(1),
              paddingRight: theme.spacing(1),
            },
          },
        },
      }}
      >
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
      </MuiThemeProvider>
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
  historyClick: () => { },
  currentClick: () => { },
  selectedHistory: '',
};

export default withStyles(styles)(NestedList);
