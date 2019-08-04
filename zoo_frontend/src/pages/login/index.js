import { compose } from 'recompose';
import withAuth from '../../util/withAuth';

import styles from './login.styles';

import login from './login';
import { withStyles } from '@material-ui/core/styles';

export default compose(
  withAuth(['unauthenticated', 'authenticated', 'kitchen', 'admin']),
  withStyles(styles),
)(login);
