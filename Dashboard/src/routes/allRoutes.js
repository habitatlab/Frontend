import React from "react"
import { Redirect } from "react-router-dom"

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

//  // Inner Authentication
import Login1 from "../pages/AuthenticationInner/Login"
import Register1 from "../pages/AuthenticationInner/Register"
import ForgetPwd1 from "../pages/AuthenticationInner/ForgetPassword"
import LockScreen from "../pages/AuthenticationInner/auth-lock-screen"

import AnimalHealth from "../pages/AnimalHealth/daily-log"
import DataQuery from "../pages/DataQuery/data-query"
import BurrowControl from "../pages/BurrowControl/burrow-control"
import MiscVideos from "../pages/MiscVideos/miscvideos"

const userRoutes = [
  { path: "/daily-log", component: AnimalHealth },
  { path: "/dataquery", component: DataQuery },
  { path: "/burrow-control", component: BurrowControl },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: () => <Redirect to="/daily-log" /> }
]

const authRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },
  { path: "/miscvideos", component: MiscVideos },

  // Authentication Inner
  { path: "/pages-login", component: Login1 },
  { path: "/pages-register", component: Register1 },
  { path: "/pages-forget-pwd", component: ForgetPwd1 },
  { path: "/auth-lock-screen", component: LockScreen },
]

export { userRoutes, authRoutes }
