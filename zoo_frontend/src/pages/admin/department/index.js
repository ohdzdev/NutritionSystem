import { compose } from 'recompose';
import withAuth from '../../../util/withAuth';

import { Admin } from '../../PageAccess';

import page from './department';

import styles from './department.styles';
import { withStyles } from '@material-ui/core';

export default compose(
  withAuth(Admin.department.roles),
  withStyles(styles),
)(page);
