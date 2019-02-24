import { withStyles } from '@material-ui/core';

import Roles from '../../static/Roles';

import page from './user';
import styles from './user.styles';

const allowedRoles = {
  link: '/admin/user',
  roles: [Roles.ADMIN],
  edit: {
    link: '/admin/user/edit',
    roles: [Roles.ADMIN],
  },
  new: {
    link: '/admin/user/new',
    roles: [Roles.ADMIN],
  },
  'pw-reset': {
    link: '/admin/user/pw-reset',
    roles: [Roles.ADMIN, Roles.NUTRITIONIST],
  },
};

const styledPage = withStyles(styles)(page);
styledPage.allowedRoles = allowedRoles.roles;

export default styledPage;
export { allowedRoles };
