import Loading from './../../../../components/loading.js';
import Loadable from 'react-loadable';

// import List from './List'
// import Log from './Log'
// import Filter from './Filter'
// import Purge from './Purge'

const List = Loadable({
    loader: () => import('./List' /* webpackChunkName: 'MonitoringList' */),
    loading: Loading
});

const Log = Loadable({
    loader: () => import('./Log' /* webpackChunkName: 'MonitoringLog' */),
    loading: Loading
});

const Filter = Loadable({
    loader: () => import('./Filter' /* webpackChunkName: 'MonitoringFilter' */),
    loading: Loading
});

const Purge = Loadable({
    loader: () => import('./Purge' /* webpackChunkName: 'MonitoringPurge' */),
    loading: Loading
});

export default {
    List,
    Filter,
    Purge,
    Log
}