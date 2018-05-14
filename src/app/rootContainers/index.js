import React from 'react';
import Root from './Root';
import Store from './../../config/store/';
import {render} from 'react-dom';
import './../style/index.less';

const store = Store();
window.store = store;
const rootElement = document.getElementById('root');
render(<Root store={store} />, rootElement);
