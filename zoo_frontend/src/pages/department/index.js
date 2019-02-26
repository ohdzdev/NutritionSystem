import { withStyles } from '@material-ui/core';

import Roles from '../../static/Roles';

import page from './department';
import styles from './department.styles';

const allowedRoles = {
  link: '/admin/department',
  roles: [Roles.ADMIN],
  edit: {
    link: '/admin/department/edit',
    roles: [Roles.ADMIN],
  },
  new: {
    link: '/admin/department/new',
    roles: [Roles.ADMIN],
  },
};

const styledPage = withStyles(styles)(page);
styledPage.allowedRoles = allowedRoles.roles;

export default styledPage;
export { allowedRoles };
