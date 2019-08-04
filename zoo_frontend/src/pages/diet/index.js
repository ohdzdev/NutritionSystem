import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import withAuth from '../../util/withAuth';

import { Diet } from '../PageAccess';

import page from './diet';

import styles from './diet.styles';

export default compose(
  withAuth(Diet.roles),
  withStyles(styles),
)(page);
