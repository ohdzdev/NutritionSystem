import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import withAuth from '../../../util/withAuth';

import { Food } from '../../PageAccess';

import page from './units';

import styles from './units.styles';

export default compose(
  withAuth(Food.units.roles),
  withStyles(styles),
)(page);
