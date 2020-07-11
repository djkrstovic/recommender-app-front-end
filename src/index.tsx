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
import { MainMenu, MainMenuItem } from './components/MainMenu/MainMenu';
import { HashRouter, Switch, Route } from 'react-router-dom';
import ContactPage from './components/ContactPage/ContactPage';
import UserLoginPage from './components/UserLoginPage/UserLoginPage';
import AdministratorLoginPage from './components/AdministratorLoginPage/AdministratorLoginPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import {UserRegistrationPage} from './components/UserRegistrationPage/UserRegistrationPage';
import AdministratorDashboard from './components/AdministratorDashboard/AdministratorDashboard';


const menuItems = [
  new MainMenuItem("Home", "/"),
  new MainMenuItem("Contact", "/contact"),
  new MainMenuItem("Register", "/user/register"),
  new MainMenuItem("User log in", "/user/login"),
  new MainMenuItem("Administrator log in", "/administrator/login"),
];

ReactDOM.render(
  <React.StrictMode>
    <MainMenu items={ menuItems }></MainMenu>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={ HomePage } />
        <Route exact path="/contact" component={ ContactPage } />
        <Route exact path="/user/login" component={ UserLoginPage } />
        <Route exact path="/user/register" component={ UserRegistrationPage } />
        <Route exact path="/category/:cId" component={ CategoryPage } />
        <Route exact path="/administrator/login" component={ AdministratorLoginPage } />
        <Route exact path="/administrator/dashboard" component={ AdministratorDashboard } />
      </Switch>
    </HashRouter>

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
