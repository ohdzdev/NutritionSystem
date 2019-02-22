import withStyles from '@material-ui/core/styles/withStyles';

import { page, styles } from '../../../src/pages/department/edit';

const p = withStyles(styles)(page);

p.allowedRoles = ['admin'];

export default p;
