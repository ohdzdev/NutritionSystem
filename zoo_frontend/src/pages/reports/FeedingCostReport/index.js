import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import withAuth from '../../../util/withAuth';

import { Reports } from '../../PageAccess';

import page from './FeedingCostReport';
import styles from './FeedingCostReport.styles';

export default compose(
  withAuth(Reports.feedingCostReport.roles),
  withStyles(styles),
)(page);
