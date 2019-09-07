import { compose } from 'recompose';

import withAuth from '../../util/withAuth';

import { Profile } from '../PageAccess';

import page from './reports';

export default compose(withAuth(Profile.roles))(page);
