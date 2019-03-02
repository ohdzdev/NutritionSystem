import { withStyles } from '@material-ui/core';
import { compose } from 'recompose';

import withAuth from '../../util/withAuth';
import Roles from '../../static/Roles';

import page from './home';
import styles from './home.styles';

const allowedRoles = {
  link: '/',
  roles: [Roles.ADMIN, Roles.NUTRITIONIST, Roles.KITCHEN, Roles.SUPERVISOR],
};

export default compose(
  withStyles(styles),
  withAuth(allowedRoles.roles),
)(page);

export { allowedRoles };
