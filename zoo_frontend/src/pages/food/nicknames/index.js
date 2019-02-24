import { withStyles } from '@material-ui/core';

import page from './nicknames';
import styles from './nicknames.styles';

import { allowedRoles } from '..';

const styledPage = withStyles(styles)(page);
styledPage.allowedRoles = allowedRoles.nicknames.roles;

export default styledPage;
export { allowedRoles };
