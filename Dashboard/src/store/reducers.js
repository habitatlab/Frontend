import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"

import logs from "./dailylogs/reducer"

import animals from "./animal/reducer"
import dataquery from "./query/reducer"
import devicecontrol from "./devicecontrol/reducer"
//contacts

const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  logs,
  animals,
  dataquery,
  devicecontrol
})

export default rootReducer
