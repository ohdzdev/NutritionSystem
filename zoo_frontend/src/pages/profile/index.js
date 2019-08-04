import { compose } from 'recompose';
import { withStyles } from '@material-ui/core';
import withAuth from '../../util/withAuth';

import { Profile } from '../PageAccess';

import page from './profile';

import styles from './profile.styles';

export default compose(
  withAuth(Profile.roles),
  withStyles(styles),
)(page);
