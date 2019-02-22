import withStyles from '@material-ui/core/styles/withStyles';

import { page, styles } from '../../../src/pages/department/new';

const p = withStyles(styles)(page);

p.allowedRoles = ['admin', 'kitchen'];

export default p;
