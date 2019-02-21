import withStyles from '@material-ui/core/styles/withStyles';

import styles from './home.styles';
import home from './home';

const page = withStyles(styles)(home);

page.allowedRoles = ['kitchen', 'admin'];

export default page;
