import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import withAuth from '../../../util/withAuth';

import { Profile } from '../../PageAccess';

import page from './FeedingCostReport';
import styles from './FeedingCostReport.styles';

export default compose(
  withAuth(Profile.roles),
  withStyles(styles),
)(page);
