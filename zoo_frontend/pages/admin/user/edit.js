import withStyles from '@material-ui/core/styles/withStyles';

import { page, styles } from '../../../src/pages/user/edit';

const p = withStyles(styles)(page);

p.allowedRoles = ['admin', 'kitchen'];

export default p;
