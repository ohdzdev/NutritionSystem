import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import withAuth from '../../util/withAuth';

import { Home } from '../PageAccess';

import page from './home';
import styles from './home.styles';

export default compose(
  withAuth(Home.roles),
  withStyles(styles),
)(page);
