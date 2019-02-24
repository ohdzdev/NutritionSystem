import { withStyles } from '@material-ui/core';

import { allowedRoles } from '..';

import page from './pw-reset';
import styles from './pw-reset.styles';

const styledPage = withStyles(styles)(page);
styledPage.allowedRoles = allowedRoles['pw-reset'].roles;

export default styledPage;
