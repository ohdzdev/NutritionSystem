import withStyles from '@material-ui/core/styles/withStyles';

import { page, styles } from '../../src/pages/food/edit';

const p = withStyles(styles)(page);

p.allowedRoles = ['kitchen', 'admin'];

export default p;
