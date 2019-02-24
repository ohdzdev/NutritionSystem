import { withStyles } from '@material-ui/core';

import Roles from '../../static/Roles';

import page from './home';
import styles from './home.styles';

const allowedRoles = {
  link: '/',
  roles: [Roles.ADMIN, Roles.NUTRITIONIST, Roles.KITCHEN, Roles.SUPERVISOR],
};

const styledPage = withStyles(styles)(page);
styledPage.allowedRoles = allowedRoles.roles;

export default styledPage;
export { allowedRoles }; // eslint-disable-line
