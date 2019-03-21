import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import HomeIcon from '@material-ui/icons/Home';
import FoodIcon from '@material-ui/icons/Restaurant';
import DietIcon from '@material-ui/icons/FormatListBulleted';
import AdminIcon from '@material-ui/icons/Security';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import DepartmentIcon from '@material-ui/icons/Business';
import SpeciesIcon from '@material-ui/icons/Pets';
import UsersIcon from '@material-ui/icons/SupervisorAccount';
import ProfileIcon from '@material-ui/icons/AccountCircle';
import Link from 'next/link';

import { AuthContext } from '../util/AuthProvider';

import {
  hasAccess,
  Home,
  Food,
  Diet,
  Admin,
  Profile,
} from '../pages/PageAccess';

const drawerWidth = 240;

const styles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});

const SidebarDrawer = (props) => {
  const {
    classes, drawerOpen, theme, handleDrawerClose,
  } = props;

  const [adminCollapse, setAdminCollapse] = useState(false);

  return (
    <AuthContext.Consumer>
      {({ account: { role } }) => (
        <div>
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={drawerOpen}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
              </IconButton>
            </div>
            <Divider />
            <List disablePadding>
              {hasAccess(role, Home.roles) &&
                <Link href={Home.link}>
                  <ListItem button key="home" divider>
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Home" />
                  </ListItem>
                </Link>
              }
              {hasAccess(role, Food.roles) &&
                <Link href={Food.link}>
                  <ListItem button key="food" divider>
                    <ListItemIcon><FoodIcon /></ListItemIcon>
                    <ListItemText primary="Food" />
                  </ListItem>
                </Link>
              }
              {hasAccess(role, Diet.roles) &&
                <Link href={Diet.link}>
                  <ListItem button key="diet" divider>
                    <ListItemIcon><DietIcon /></ListItemIcon>
                    <ListItemText primary="Diets" />
                  </ListItem>
                </Link>
              }
              {hasAccess(role, Profile.roles) &&
                <Link href={Profile.link}>
                  <ListItem button key="profile" divider>
                    <ListItemIcon><ProfileIcon /></ListItemIcon>
                    <ListItemText primary="My Profile" />
                  </ListItem>
                </Link>
              }
              {hasAccess(role, Admin.roles) &&
                <Fragment>
                  <ListItem
                    button
                    key="admin"
                    onClick={() => setAdminCollapse(!adminCollapse)}
                  >
                    <ListItemIcon><AdminIcon /></ListItemIcon>
                    <ListItemText primary="Admin" />
                    {adminCollapse ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={adminCollapse} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {hasAccess(role, Admin.department.roles) &&
                        <Link href={Admin.department.link}>
                          <ListItem button className={classes.nested}>
                            <ListItemIcon><DepartmentIcon /></ListItemIcon>
                            <ListItemText inset primary="Departments" />
                          </ListItem>
                        </Link>
                      }
                      {hasAccess(role, Admin.species.roles) &&
                        <Link href={Admin.species.link}>
                          <ListItem button className={classes.nested}>
                            <ListItemIcon><SpeciesIcon /></ListItemIcon>
                            <ListItemText inset primary="Species" />
                          </ListItem>
                        </Link>
                      }
                      {hasAccess(role, Admin.user.roles) &&
                        <Link href={Admin.user.link}>
                          <ListItem button className={classes.nested}>
                            <ListItemIcon><UsersIcon /></ListItemIcon>
                            <ListItemText inset primary="Users" />
                          </ListItem>
                        </Link>
                      }
                    </List>
                  </Collapse>
                  <Divider />
                </Fragment>
              }
            </List>
          </Drawer>
        </div>
      )}
    </AuthContext.Consumer>
  );
};

SidebarDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  drawerOpen: PropTypes.bool.isRequired,
  handleDrawerClose: PropTypes.func.isRequired,
};

export default withStyles(styles, { withTheme: true })(SidebarDrawer);
