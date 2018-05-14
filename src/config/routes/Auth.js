import React from 'react'
import { Redirect } from 'react-router-dom'

// pages
// import Auth from './../../web/containers/auth/Auth.js'
// import Login from './../../web/containers/auth/Login.js'
// import Register from './../../web/containers/auth/Register.js'
import Loading from './../../app/components/loading.js'
import Loadable from 'react-loadable';

const Auth = Loadable({
    loader: () => import('./../../app/containers/auth/Auth.js' /* webpackChunkName: 'Auth' */),
    loading: Loading
});

const Login = Loadable({
    loader: () => import('./../../app/containers/auth/Login.js' /* webpackChunkName: 'Login' */),
    loading: Loading
});

const Register = Loadable({
    loader: () => import('./../../app/containers/auth/Register.js' /* webpackChunkName: 'Register' */),
    loading: Loading
});

export default {
    path: '/auth',
    component: Auth,
    routes: [{
        path: '/auth/login',
        component: Login
    }, {
        path: '/auth/register',
        component: Register
    }, {
        path : '*',
        component : () => console.log("should redirect")
        // <Redirect to="/auth/login" />
    }]
}