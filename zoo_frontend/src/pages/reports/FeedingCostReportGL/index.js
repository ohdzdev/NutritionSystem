import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import withAuth from '../../../util/withAuth';

import { Reports } from '../../PageAccess';

import page from './FeedingCostReportGL';
import styles from './FeedingCostReportGL.styles';

export default compose(
  withAuth(Reports.feedingCostReportGL.roles),
  withStyles(styles),
)(page);
