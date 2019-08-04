import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import withAuth from '../../../util/withAuth';

import { Food } from '../../PageAccess';

import page from './nutrDef';

import styles from './nutrDef.styles';

export default compose(
  withAuth(Food.roles),
  withStyles(styles),
)(page);
