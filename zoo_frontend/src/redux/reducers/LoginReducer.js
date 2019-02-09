import { LoginActions } from '../ActionTypes';

const initialState = {
  loggedIn: false,
  firstName: '',
  lastName: '',
  token: '',
  email: '',
  role: '',
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LoginActions.LOGIN:
      return {
        ...state,
        loggedIn: true,
        firstName: action.firstName,
        lastName: action.lastName,
        token: action.token,
        email: action.email,
        role: action.role,
      };
    case LoginActions.LOGOUT:
      return {
        ...state,
        loggedIn: false,
        firstName: '',
        lastName: '',
        token: '',
        email: '',
        role: '',
      };
    default:
      return state;
  }
};

export default loginReducer;
