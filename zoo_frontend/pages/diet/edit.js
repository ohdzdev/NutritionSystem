import withStyles from '@material-ui/core/styles/withStyles';

import { page, styles } from '../../src/pages/diet/edit';

const p = withStyles(styles)(page);

p.allowedRoles = ['admin', 'kitchen'];

export default p;
