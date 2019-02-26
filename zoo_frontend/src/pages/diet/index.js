import { withStyles } from '@material-ui/core';

import Roles from '../../static/Roles';

import page from './diet';
import styles from './diet.styles';

const allowedRoles = {
  link: '/diet',
  roles: [Roles.ADMIN, Roles.NUTRITIONIST, Roles.KITCHEN, Roles.SUPERVISOR],
  edit: {
    link: '/diet/edit',
    roles: [Roles.ADMIN, Roles.NUTRITIONIST],
  },
  new: {
    link: '/diet/new',
    roles: [Roles.ADMIN, Roles.NUTRITIONIST],
  },
};

const styledPage = withStyles(styles)(page);
styledPage.allowedRoles = allowedRoles.roles;

export default styledPage;
export { allowedRoles };
