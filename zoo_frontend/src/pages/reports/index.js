import { compose } from 'recompose';

import withAuth from '../../util/withAuth';

import { Reports } from '../PageAccess';

import page from './reports';

export default compose(withAuth(Reports.roles))(page);
