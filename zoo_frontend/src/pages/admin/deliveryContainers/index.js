import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import withAuth from '../../../util/withAuth';

import { Admin } from '../../PageAccess';

import page from './deliveryContainers';

import styles from './deliveryContainers.styles';


export default compose(
  withAuth(Admin.deliveryContainers.roles),
  withStyles(styles),
)(page);
