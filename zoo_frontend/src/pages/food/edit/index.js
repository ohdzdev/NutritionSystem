import { compose } from 'recompose';
import withAuth from '../../../util/withAuth';

import { Food } from '../../PageAccess';

import page from './edit';

import styles from './edit.styles';
import { withStyles } from '@material-ui/core/styles';

export default compose(
  withAuth(Food.edit.roles),
  withStyles(styles),
)(page);
