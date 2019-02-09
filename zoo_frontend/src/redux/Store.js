import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';

import Reducers from './reducers';

export default () => createStore(combineReducers(Reducers), undefined, composeWithDevTools(applyMiddleware(thunk)));
