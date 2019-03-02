import withStyles from '@material-ui/core/styles/withStyles';

import styles from './admin.styles';
import admin from './admin';

const page = withStyles(styles)(admin);

page.allowedRoles = ['admin', 'kitchen'];

export default page;
