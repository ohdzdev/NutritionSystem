import withStyles from '@material-ui/core/styles/withStyles';

import styles from '../../src/pages/admin/admin.styles';
import admin from '../../src/pages/admin/admin';

const page = withStyles(styles)(admin);

page.allowedRoles = ['admin', 'kitchen'];

export default page;
