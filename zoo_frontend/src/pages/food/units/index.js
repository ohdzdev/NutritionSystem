import { compose } from 'recompose';
import withAuth from '../../../util/withAuth';

import { Food } from '../../PageAccess';

import page from './units';

import styles from './units.styles';
import { withStyles } from '@material-ui/core/styles';

export default compose(
  withAuth(Food.units.roles),
  withStyles(styles),
)(page);
