import withStyles from '@material-ui/core/styles/withStyles';

import styles from './food.styles';
import food from './food';

const page = withStyles(styles)(food);

page.allowedRoles = ['kitchen', 'admin'];

export default food;
