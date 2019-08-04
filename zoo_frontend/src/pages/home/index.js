import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import withAuth from '../../util/withAuth';

import { Home } from '../PageAccess';

import page from './home';

import styles from './home.styles';

export default compose(
  withAuth(Home.roles),
  withStyles(styles),
)(page);
