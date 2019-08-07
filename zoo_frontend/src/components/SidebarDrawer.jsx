import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';

import AdminIcon from '@material-ui/icons/Security';
import AssIcon from '@material-ui/icons/Assignment';
import BookIcon from '@material-ui/icons/Book';
import Chat from '@material-ui/icons/Chat';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DeliveryContainersIcon from '@material-ui/icons/ShoppingCart';
import DepartmentIcon from '@material-ui/icons/Business';
import DietIcon from '@material-ui/icons/FormatListBulleted';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import FoodIcon from '@material-ui/icons/Restaurant';
import FoodPrepTableIcon from '@material-ui/icons/TableChart';
import HomeIcon from '@material-ui/icons/Home';
import KitchenIcon from '@material-ui/icons/Kitchen';
import ProfileIcon from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';
import SpeciesIcon from '@material-ui/icons/Pets';
import UsersIcon from '@material-ui/icons/SupervisorAccount';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRulerCombined, faCrow } from '@fortawesome/free-solid-svg-icons';

import Link from 'next/link';

import { AuthContext } from '../util/AuthProvider';

import { hasAccess, Home, Food, Diet, Admin, Profile, Kitchen } from '../pages/PageAccess';

const drawerWidth = 240;

const styles = (theme) => ({
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
  const { classes, drawerOpen, theme, handleDrawerClose } = props;

  const [adminCollapse, setAdminCollapse] = useState(false);
  const [foodCollapse, setFoodCollapse] = useState(false);

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
              {hasAccess(role, Home.roles) && (
                <Link href={Home.link}>
                  <ListItem button key="home" divider>
                    <ListItemIcon>
                      <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                  </ListItem>
                </Link>
              )}
              {hasAccess(role, Diet.roles) && (
                <Link href={Diet.link}>
                  <ListItem button key="diet" divider>
                    <ListItemIcon>
                      <DietIcon />
                    </ListItemIcon>
                    <ListItemText primary="Diets" />
                  </ListItem>
                </Link>
              )}
              {hasAccess(role, Kitchen.roles) && (
                <Link href={Kitchen.link}>
                  <ListItem button key="kitchen" divider>
                    <ListItemIcon>
                      <KitchenIcon />
                    </ListItemIcon>
                    <ListItemText primary="Kitchen" />
                  </ListItem>
                </Link>
              )}
              {hasAccess(role, Food.roles) && (
                <Fragment>
                  <ListItem button key="foodMenu" onClick={() => setFoodCollapse(!foodCollapse)}>
                    <ListItemIcon>
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Nutrition Setup" />
                    {foodCollapse ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={foodCollapse} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {hasAccess(role, Food.roles) && (
                        <Link href={Food.link}>
                          <ListItem button className={classes.nested}>
                            <ListItemIcon>
                              <FoodIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="Food" />
                          </ListItem>
                        </Link>
                      )}
                      {hasAccess(role, Food.nutrDef.roles) && (
                        <Link href={Food.nutrDef.link}>
                          <ListItem button className={classes.nested}>
                            <ListItemIcon>
                              <AssIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="Nutrient Definitions" />
                          </ListItem>
                        </Link>
                      )}
                      {hasAccess(role, Food.dataSrc.roles) && (
                        <Link href={Food.dataSrc.link}>
                          <ListItem button className={classes.nested}>
                            <ListItemIcon>
                              <BookIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="References" />
                          </ListItem>
                        </Link>
                      )}
                      {hasAccess(role, Food.prepTables.roles) && (
                        <Link href={Food.prepTables.link}>
                          <ListItem button className={classes.nested}>
                            <ListItemIcon>
                              <FoodPrepTableIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="Food Prep Tables" />
                          </ListItem>
                        </Link>
                      )}
                      {hasAccess(role, Food.units.roles) && (
                        <Link href={Food.units.link}>
                          <ListItem button className={classes.nested}>
                            <ListItemIcon style={{ paddingLeft: '6px' }}>
                              <FontAwesomeIcon icon={faRulerCombined} />
                            </ListItemIcon>
                            <ListItemText inset primary="Units" />
                          </ListItem>
                        </Link>
                      )}
                      {hasAccess(role, Food.nicknames.roles) && (
                        <Link href={Food.nicknames.link}>
                          <ListItem button className={classes.nested}>
                            <ListItemIcon>
                              <Chat />
                            </ListItemIcon>
                            <ListItemText inset primary="Food Nicknames" />
                          </ListItem>
                        </Link>
                      )}
                    </List>
                  </Collapse>
                  <Divider />
                </Fragment>
              )}
              {hasAccess(role, Admin.roles) && (
                <Fragment>
                  <ListItem button key="admin" onClick={() => setAdminCollapse(!adminCollapse)}>
                    <ListItemIcon>
                      <AdminIcon />
                    </ListItemIcon>
                    <ListItemText primary="Admin" />
                    {adminCollapse ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={adminCollapse} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {hasAccess(role, Admin.deliveryContainers.roles) && (
                        <Link href={Admin.deliveryContainers.link}>
                          <ListItem button className={classes.nested}>
                            <ListItemIcon>
                              <DeliveryContainersIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="Delivery Containers" />
                          </ListItem>
                        </Link>
                      )}
                      {hasAccess(role, Admin.department.roles) && (
                        <Link href={Admin.department.link}>
                          <ListItem button className={classes.nested}>
                            <ListItemIcon>
                              <DepartmentIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="Departments" />
                          </ListItem>
                        </Link>
                      )}
                      {hasAccess(role, Admin.groupDiets.roles) && (
                        <Link href={Admin.groupDiets.link}>
                          <ListItem button className={classes.nested}>
                            <ListItemIcon style={{ marginLeft: -2.6 }}>
                              <FontAwesomeIcon icon={faCrow} size="lg" />
                            </ListItemIcon>
                            <ListItemText inset primary="Group Diets" />
                          </ListItem>
                        </Link>
                      )}
                      {hasAccess(role, Admin.species.roles) && (
                        <Link href={Admin.species.link}>
                          <ListItem button className={classes.nested}>
                            <ListItemIcon>
                              <SpeciesIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="Species" />
                          </ListItem>
                        </Link>
                      )}
                      {hasAccess(role, Admin.user.roles) && (
                        <Link href={Admin.user.link}>
                          <ListItem button className={classes.nested}>
                            <ListItemIcon>
                              <UsersIcon />
                            </ListItemIcon>
                            <ListItemText inset primary="Users" />
                          </ListItem>
                        </Link>
                      )}
                    </List>
                  </Collapse>
                  <Divider />
                </Fragment>
              )}
              {hasAccess(role, Profile.roles) && (
                <Link href={Profile.link}>
                  <ListItem button key="profile" divider>
                    <ListItemIcon>
                      <ProfileIcon />
                    </ListItemIcon>
                    <ListItemText primary="My Profile" />
                  </ListItem>
                </Link>
              )}
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
