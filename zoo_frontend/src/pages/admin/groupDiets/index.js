import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import withAuth from '../../../util/withAuth';

import { Admin } from '../../PageAccess';

import page from './groupDiets';
import styles from './groupDiets.styles';

export default compose(
  withAuth(Admin.groupDiets.roles),
  withStyles(styles),
)(page);
