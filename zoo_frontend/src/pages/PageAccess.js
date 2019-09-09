import Roles from '../static/Roles';

/**
 * helper function for determining wether or not user has access to a page from a pageAccess role list
 * @param {String} userRole user's role
 * @param {Array<String>} pageRoles from local import to related to this file send in the roles of a page that you want checked to see if a user has access to this page
 */
const hasAccess = (userRole, pageRoles) => pageRoles.indexOf(userRole) !== -1;

export { hasAccess };

export const Admin = {
  link: '/admin',
  roles: [Roles.ADMIN],
  budgetIds: {
    link: '/admin/budgetids',
    roles: [Roles.ADMIN],
  },
  deliveryContainers: {
    link: '/admin/delivery-containers',
    roles: [Roles.ADMIN],
  },
  department: {
    link: '/admin/department',
    roles: [Roles.ADMIN],
  },
  groupDiets: {
    link: '/admin/group-diets',
    roles: [Roles.ADMIN],
  },
  species: {
    link: '/admin/species',
    roles: [Roles.ADMIN],
  },
  user: {
    link: '/admin/user',
    roles: [Roles.ADMIN],
  },
};

export const Diet = {
  link: '/diet',
  roles: [Roles.ADMIN, Roles.NUTRITIONIST, Roles.KITCHEN, Roles.KITCHENPLUS, Roles.SUPERVISOR],
  edit: {
    link: '/diet/edit',
    roles: [Roles.ADMIN, Roles.NUTRITIONIST, Roles.KITCHENPLUS],
  },
  new: {
    link: '/diet/new',
    roles: [Roles.ADMIN, Roles.NUTRITIONIST],
  },
};

export const Food = {
  link: '/food',
  roles: [Roles.ADMIN, Roles.NUTRITIONIST, Roles.KITCHEN, Roles.KITCHENPLUS, Roles.SUPERVISOR],
  edit: {
    link: '/food/edit',
    roles: [Roles.ADMIN, Roles.NUTRITIONIST],
  },
  new: {
    link: '/food/new',
    roles: [Roles.ADMIN, Roles.NUTRITIONIST],
  },
  nicknames: {
    link: '/food/nicknames',
    roles: [Roles.ADMIN, Roles.KITCHEN, Roles.KITCHENPLUS, Roles.NUTRITIONIST, Roles.SUPERVISOR],
  },
  dataSrc: {
    link: '/food/dataSrc',
    roles: [Roles.ADMIN, Roles.NUTRITIONIST],
  },
  prepTables: {
    link: '/food/prepTables',
    roles: [Roles.ADMIN, Roles.NUTRITIONIST],
  },
  nutrDef: {
    link: '/food/nutrDef',
    roles: [Roles.ADMIN, Roles.NUTRITIONIST],
  },
  units: {
    link: '/food/units',
    roles: [Roles.ADMIN, Roles.NUTRITIONIST],
  },
};

export const Home = {
  link: '/',
  roles: [
    Roles.ADMIN,
    Roles.NUTRITIONIST,
    Roles.KITCHEN,
    Roles.KITCHENPLUS,
    Roles.SUPERVISOR,
    Roles.KEEPER,
  ],
};

export const Profile = {
  link: '/profile',
  roles: [
    Roles.ADMIN,
    Roles.NUTRITIONIST,
    Roles.KITCHEN,
    Roles.KITCHENPLUS,
    Roles.SUPERVISOR,
    Roles.KEEPER,
  ],
};

export const Kitchen = {
  link: '/kitchen',
  roles: [Roles.ADMIN, Roles.NUTRITIONIST, Roles.KITCHEN, Roles.KITCHENPLUS, Roles.SUPERVISOR],
  prep: {
    link: '/kitchen/prep',
    roles: [Roles.ADMIN, Roles.NUTRITIONIST, Roles.KITCHEN, Roles.KITCHENPLUS, Roles.SUPERVISOR],
  },
};

export const Reports = {
  link: '/reports',
  roles: [Roles.ADMIN, Roles.NUTRITIONIST, Roles.SUPERVISOR],
  dietCostReport: {
    link: '/reports/diet-cost-report',
    roles: [Roles.ADMIN, Roles.NUTRITIONIST, Roles.SUPERVISOR],
  },
  feedingCostReport: {
    link: '/reports/feeding-cost-report',
    roles: [Roles.ADMIN, Roles.NUTRITIONIST, Roles.SUPERVISOR],
  },
  feedingCostReportGL: {
    link: '/reports/feeding-cost-report-gl',
    roles: [Roles.ADMIN, Roles.NUTRITIONIST, Roles.SUPERVISOR],
  },
};
