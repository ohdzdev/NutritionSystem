import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import withAuth from '../../../util/withAuth';

import { Food } from '../../PageAccess';

import page from './edit';

import styles from './edit.styles';

export default compose(
  withAuth(Food.edit.roles),
  withStyles(styles),
)(page);
