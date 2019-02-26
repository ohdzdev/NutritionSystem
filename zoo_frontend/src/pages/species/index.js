import { withStyles } from '@material-ui/core';

import Roles from '../../static/Roles';

import page from './species';
import styles from './species.styles';

const allowedRoles = {
  link: '/admin/species',
  roles: [Roles.ADMIN, Roles.NUTRITIONIST, Roles.KITCHEN, Roles.SUPERVISOR],
  edit: {
    link: '/admin/species/edit',
    roles: [Roles.ADMIN, Roles.NUTRITIONIST],
  },
  new: {
    link: '/admin/species/new',
    roles: [Roles.ADMIN, Roles.NUTRITIONIST],
  },
};

const styledPage = withStyles(styles)(page);
styledPage.allowedRoles = allowedRoles.roles;

export default styledPage;
export { allowedRoles };
