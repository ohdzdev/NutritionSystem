import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import withAuth from '../../../util/withAuth';

import { Admin } from '../../PageAccess';

import page from './budgetIds';
import styles from './budgetIds.styles';

export default compose(
  withAuth(Admin.budgetIds.roles),
  withStyles(styles),
)(page);
