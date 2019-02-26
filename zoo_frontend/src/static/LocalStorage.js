const EMAIL_KEY = 'profile_email';

const getEmail = () => localStorage.getItem(EMAIL_KEY);
const setEmail = (email) => localStorage.setItem(EMAIL_KEY, email);

const FIRSTNAME_KEY = 'profile_firstname';

const getFirstName = () => localStorage.getItem(FIRSTNAME_KEY);
const setFirstName = (firstName) => localStorage.setItem(FIRSTNAME_KEY, firstName);

const LASTNAME_KEY = 'profile_lastname';

const getLastName = () => localStorage.getItem(LASTNAME_KEY);
const setLastName = (lastName) => localStorage.setItem(LASTNAME_KEY, lastName);

const ROLE_KEY = 'profile_role';

const getRole = () => localStorage.getItem(ROLE_KEY);
const setRole = (role) => localStorage.setItem(ROLE_KEY, role);

const ID_KEY = 'profile_id';

const getId = () => localStorage.getItem(ID_KEY);
const setId = (id) => localStorage.setItem(ID_KEY, id);

export default {
  getEmail,
  setEmail,
  getFirstName,
  setFirstName,
  getLastName,
  setLastName,
  getRole,
  setRole,
  getId,
  setId,
};
