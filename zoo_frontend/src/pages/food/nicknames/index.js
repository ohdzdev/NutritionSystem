import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import withAuth from '../../../util/withAuth';

import { Food } from '../../PageAccess';

import page from './nicknames';

import styles from './nicknames.styles';

export default compose(
  withAuth(Food.nicknames.roles),
  withStyles(styles),
)(page);
