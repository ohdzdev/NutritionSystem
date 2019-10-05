import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import withAuth from '../../../util/withAuth';

import { Food } from '../../PageAccess';

import page from './nutrDef';
import styles from './nutrDef.styles';

export default compose(
  withAuth(Food.nutrDef.roles),
  withStyles(styles),
)(page);
