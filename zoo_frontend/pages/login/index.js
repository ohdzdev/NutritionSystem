import withStyles from '@material-ui/core/styles/withStyles';

import styles from './login.styles';
import login from './login';

const page = withStyles(styles)(login);

page.allowedRoles = ['unauthenticated'];

export default page;
