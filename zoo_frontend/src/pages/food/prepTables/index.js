import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import withAuth from '../../../util/withAuth';

import { Food } from '../../PageAccess';

import page from './prepTables';
import styles from './prepTables.styles';

export default compose(
  withAuth(Food.prepTables.roles),
  withStyles(styles),
)(page);
