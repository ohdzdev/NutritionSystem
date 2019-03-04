import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import withAuth from '../../../util/withAuth';

import { Food } from '../../PageAccess';

import page from './new';
import styles from './new.styles';

export default compose(
  withAuth(Food.new.roles),
  withStyles(styles),
)(page);
