import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';

import withAuth from '../../../util/withAuth';

import { Reports } from '../../PageAccess';

import page from './DietCostReport';
import styles from './DietCostReport.styles';

export default compose(
  withAuth(Reports.dietCostReport.roles),
  withStyles(styles),
)(page);
