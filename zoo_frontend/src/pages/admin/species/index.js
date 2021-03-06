import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import withAuth from '../../../util/withAuth';

import { Admin } from '../../PageAccess';

import page from './species';
import styles from './species.styles';

export default compose(
  withAuth(Admin.species.roles),
  withStyles(styles),
)(page);
