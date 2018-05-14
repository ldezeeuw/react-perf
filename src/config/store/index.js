import thunk from 'redux-thunk';
import {combineReducers} from 'redux';
import {Reducers} from 'uptoo-react-redux';
import {routerMiddleware} from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import {createStore, applyMiddleware, compose} from 'redux';

export const history = createHistory();

const router = routerMiddleware(history);
var createStoreWithMiddleware;

if (process.env.NODE_ENV === 'production' || process.env.PLATFORM_ENV !== 'web')
    createStoreWithMiddleware = compose(applyMiddleware(thunk), applyMiddleware(router))(createStore);
else {
    const DevTools = require('uptoo-react-web-elements/dist/DevTools').default;
    DevTools.instrument()
    createStoreWithMiddleware = compose(applyMiddleware(thunk), applyMiddleware(router))(createStore);
}

export default function configureStore() {
    const store = createStoreWithMiddleware(combineReducers(Reducers));

    if (module.hot) {
        module.hot.accept('uptoo-react-redux/dist/reducers', () => {
            store.replaceReducer(combineReducers(Reducers));
        });
    }
    return store;
};
