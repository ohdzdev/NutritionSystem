import withStyles from '@material-ui/core/styles/withStyles';

import Roles from '../../static/Roles';

import page from './admin';
import styles from './admin.styles';


const allowedRoles = {
  link: '/admin',
  roles: [Roles.ADMIN],
};

const styledPage = withStyles(styles)(page);
styledPage.allowedRoles = allowedRoles.roles;

export default styledPage;
export { allowedRoles };
