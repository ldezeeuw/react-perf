import Loading from './../../../../components/loading.js';
import Loadable from 'react-loadable';

const List = Loadable({
    loader: () => import('./List' /* webpackChunkName: 'TasksList' */),
    loading: Loading
});

const Task = Loadable({
    loader: () => import('./Task' /* webpackChunkName: 'TasksTask' */),
    loading: Loading
});

const Filter = Loadable({
    loader: () => import('./Filter' /* webpackChunkName: 'TasksFilter' */),
    loading: Loading
});

export default {
    List,
    Filter,
    Task
}