import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import withAuth from '../../util/withAuth';

import Roles from '../../static/Roles';

import page from './admin';
import styles from './admin.styles';

const allowedRoles = {
  link: '/admin',
  roles: [Roles.ADMIN],
};

export default compose(
  withStyles(styles),
  withAuth(allowedRoles.roles),
)(page);

export { allowedRoles };
