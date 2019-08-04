import { compose } from 'recompose';
import withAuth from '../../util/withAuth';

import { Kitchen } from '../PageAccess';

import page from './kitchenHome';

import styles from './kitchenHome.styles';
import { withStyles } from '@material-ui/core';

export default compose(
  withAuth(Kitchen.roles),
  withStyles(styles),
)(page);
