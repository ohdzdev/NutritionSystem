
import { withStyles } from '@material-ui/core';

import { allowedRoles } from '..';

import page from './edit';
import styles from './edit.styles';

const styledPage = withStyles(styles)(page);
styledPage.allowedRoles = allowedRoles.edit.roles;

export default styledPage;
