import React from "react"
import PropTypes from 'prop-types'
import { Route, useHistory } from "react-router-dom"
import { useEffect, useState } from "react"
import {isUserAuthenticated} from '../../helpers/fakebackend_helper.js'

const PrivateRoute =  ({ component: Component, layout: Layout }) => {
   const [auth, setAuth] = useState(false);
   let history = useHistory();

   const isAuthenticated = () => {
      console.log("ASDFAF")
      //if (!auth) {
//	   redirectToLogin();
  //    }
       setAuth(true)
	return true
   }

   const redirectToLogin = () => {
       history.push('/login');
    }

 useEffect(() => {
	         isAuthenticated();
	     }, []);

return (
   <Route
       render={props => {
             return (
		 auth ? <Layout>
	            <Component/>
	          </Layout> : null
	        )
       }}
  />
)
}

PrivateRoute.propTypes = {
  component: PropTypes.any,
  layout: PropTypes.any
}

export default PrivateRoute
