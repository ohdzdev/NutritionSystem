export { allowedRoles as Admin } from './admin';
export { allowedRoles as Department } from './department';
export { allowedRoles as Diet } from './diet';
export { allowedRoles as Food } from './food';
export { allowedRoles as Home } from './home';
export { allowedRoles as Species } from './species';
export { allowedRoles as User } from './user';

/**
 * helper function for determining wether or not user has access to a page from a pageAccess role list
 * @param {String} userRole user's role
 * @param {String} pageRoles from local import to related to this file send in the roles of a page that you want checked to see if a user has access to this page
 */
const hasAccess = (userRole, pageRoles) => pageRoles.indexOf(userRole) !== -1;

export { hasAccess };
