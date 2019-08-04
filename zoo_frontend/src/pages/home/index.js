import { compose } from 'recompose';
import withAuth from '../../util/withAuth';

import { Home } from '../PageAccess';

import page from './home';

import styles from './home.styles';
import { withStyles } from '@material-ui/core';

export default compose(
  withAuth(Home.roles),
  withStyles(styles),
)(page);
