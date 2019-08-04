import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import withAuth from '../../../util/withAuth';

import { Admin } from '../../PageAccess';

import page from './department';

import styles from './department.styles';


export default compose(
  withAuth(Admin.department.roles),
  withStyles(styles),
)(page);
