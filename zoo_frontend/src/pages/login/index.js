import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import withAuth from '../../util/withAuth';

import styles from './login.styles';
import login from './login';

export default compose(
  withStyles(styles),
  withAuth(['unauthenticated', 'authenticated', 'kitchen', 'admin']),
)(login);
