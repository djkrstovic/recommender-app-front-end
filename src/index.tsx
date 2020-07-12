import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import HomePage from './components/HomePage/HomePage';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.js';
import 'popper.js/dist/popper.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import { HashRouter, Switch, Route } from 'react-router-dom';
import ContactPage from './components/ContactPage/ContactPage';
import UserLoginPage from './components/UserLoginPage/UserLoginPage';
import AdministratorLoginPage from './components/AdministratorLoginPage/AdministratorLoginPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import {UserRegistrationPage} from './components/UserRegistrationPage/UserRegistrationPage';
import AdministratorDashboard from './components/AdministratorDashboard/AdministratorDashboard';
import AdministratorDashboardTvSeries from './components/AdministratorDashboardTvSeries/AdministratorDashboardTvSeries';
import AdministratorDashboardMovie from './components/AdministratorDashboardMovie/AdministratorDashboardMovie';
import AdministratorDashboardTag from './components/AdministratorDashboardTag/AdministratorDashboardTag';
import AdministratorDashboardGenre from './components/AdministratorDashboardGenre/AdministratorDashboardGenre';



ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={ HomePage } />
        <Route path="/contact" component={ ContactPage } />
        <Route path="/user/login" component={ UserLoginPage } />
        <Route path="/user/register" component={ UserRegistrationPage } />
        <Route path="/category/:cId" component={ CategoryPage } />
        <Route path="/administrator/login" component={ AdministratorLoginPage } />
        <Route exact path="/administrator/dashboard" component={ AdministratorDashboard } />
        <Route path="/administrator/dashboard/tvSeries" component={ AdministratorDashboardTvSeries } />
        <Route path="/administrator/dashboard/movie" component={ AdministratorDashboardMovie } />
        <Route path="/administrator/dashboard/tag" component={ AdministratorDashboardTag } />
        <Route path="/administrator/dashboard/genre" component={ AdministratorDashboardGenre } />
      </Switch>
    </HashRouter>

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
