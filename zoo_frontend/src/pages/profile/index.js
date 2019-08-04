import { compose } from 'recompose';
import withAuth from '../../util/withAuth';

import { Profile } from '../PageAccess';

import page from './profile';

import styles from './profile.styles';
import { withStyles } from '@material-ui/core';

export default compose(
  withAuth(Profile.roles),
  withStyles(styles),
)(page);
