import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import withAuth from '../../../../util/withAuth';

import { Admin } from '../../../PageAccess';

import page from './pw-reset';
import styles from './pw-reset.styles';

export default compose(
  withAuth(Admin.user['pw-reset'].roles),
  withStyles(styles),
)(page);
