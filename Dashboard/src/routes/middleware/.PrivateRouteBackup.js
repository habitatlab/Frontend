import React from "react"
import PropTypes from 'prop-types'
import { Route } from "react-router-dom"
import { useEffect, useState } from "react"

const PrivateRoute = ({ component: Component, layout: Layout }) => { 
  const [auth, setAuth] = useState(false);

  const isAuthenticated = () => {
      setAuth(false);
      Auth.currentSession().then( response => {
  	  if (response.isValid()) {
	     setAuth(true);
	  } else {
	     redirectToLogin();
	  }
      }).catch(() => {
	 console.log("SDFDSDF")
	 redirectToLogin();
      });
    }

  const redirectToLogin = () => {
      history.push('/login');
  }

  useEffect(() => {
       isAuthenticated();
  }, [])
return
(
  <Route
    render={props => {
        <Layout>
          <Component {...props} />
        </Layout>
    }}
  />
)
}

PrivateRoute.propTypes = {
  component: PropTypes.any,
  layout: PropTypes.any
}

export default PrivateRoute
