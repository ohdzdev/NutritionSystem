import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import withAuth from '../../../util/withAuth';

import { Reports } from '../../PageAccess';

import page from './RecentDietChanges';
import styles from './RecentDietChanges.styles';

export default compose(
  withAuth(Reports.recentDietChangesReport.roles),
  withStyles(styles),
)(page);
