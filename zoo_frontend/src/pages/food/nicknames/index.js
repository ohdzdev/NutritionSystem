import { compose } from 'recompose';
import withAuth from '../../../util/withAuth';

import { Food } from '../../PageAccess';

import page from './nicknames';

import styles from './nicknames.styles';
import { withStyles } from '@material-ui/core';

export default compose(
  withAuth(Food.nicknames.roles),
  withStyles(styles),
)(page);
