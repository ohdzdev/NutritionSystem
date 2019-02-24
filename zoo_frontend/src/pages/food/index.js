import { withStyles } from '@material-ui/core';

import Roles from '../../static/Roles';

import page from './food';
import styles from './food.styles';

const allowedRoles = {
  link: '/food',
  roles: [Roles.ADMIN, Roles.NUTRITIONIST, Roles.KITCHEN, Roles.SUPERVISOR],
  edit: {
    link: '/food/edit',
    roles: [Roles.ADMIN, Roles.NUTRITIONIST],
  },
  new: {
    link: '/food/new',
    roles: [Roles.ADMIN, Roles.NUTRITIONIST],
  },
};

const styledPage = withStyles(styles)(page);
styledPage.allowedRoles = allowedRoles.roles;

export default styledPage;
export { allowedRoles };
