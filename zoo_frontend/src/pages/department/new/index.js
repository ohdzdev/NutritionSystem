import { withStyles } from '@material-ui/core';

import { allowedRoles } from '..';

import page from './new';
import styles from './new.styles';

const styledPage = withStyles(styles)(page);
styledPage.allowedRoles = allowedRoles.edit.roles;

export default styledPage;
