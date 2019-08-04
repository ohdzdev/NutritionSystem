import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import withAuth from '../../util/withAuth';

import styles from './login.styles';

import login from './login';

export default compose(
  withAuth(['unauthenticated', 'authenticated', 'kitchen', 'admin']),
  withStyles(styles),
)(login);
