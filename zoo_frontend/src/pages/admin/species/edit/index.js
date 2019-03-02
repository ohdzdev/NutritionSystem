import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import withAuth from '../../../../util/withAuth';

import { Admin } from '../../../PageAccess';

import page from './edit';
import styles from './edit.styles';

export default compose(
  withAuth(Admin.roles),
  withStyles(styles),
)(page);
