import { compose } from 'recompose';
import withAuth from '../../../util/withAuth';

import { Admin } from '../../PageAccess';

import page from './deliveryContainers';

import styles from './deliveryContainers.styles';
import { withStyles } from '@material-ui/core/styles';

export default compose(
  withAuth(Admin.deliveryContainers.roles),
  withStyles(styles),
)(page);
