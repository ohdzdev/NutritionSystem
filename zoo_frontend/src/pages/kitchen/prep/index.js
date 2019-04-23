import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import withAuth from '../../../util/withAuth';

import { Kitchen } from '../../PageAccess';

import page from './kitchen';
import styles from './kitchen.styles';

export default compose(
  withAuth(Kitchen.roles),
  withStyles(styles),
)(page);
