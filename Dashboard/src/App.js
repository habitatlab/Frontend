import PropTypes from 'prop-types'
import React from "react"

import { Switch, BrowserRouter as Router } from "react-router-dom"
import { connect } from "react-redux"

// Import Routes all
import { userRoutes, authRoutes } from "./routes/allRoutes"

// Import all middleware
import Authmiddleware from "./routes/middleware/Authmiddleware"
import PrivateRoute from "./routes/middleware/PrivateRoute"

// layouts Format
import VerticalLayout from "./components/VerticalLayout/"

// Import scss
import "./assets/scss/theme.scss"

// Import Firebase Configuration file

// Activating fake backend

const App = props => {
function getLayout() {
	    let layoutCls = VerticalLayout

	    switch (props.layout.layoutType) {
		          case "horizontal":
			            layoutCls = HorizontalLayout
			            break
			          default:
			            layoutCls = VerticalLayout
			            break
			        }
	    return layoutCls
	  }

	  const Layout = getLayout()

  return (
    <React.Fragment>
      <Router>
        <Switch>
          {authRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={VerticalLayout}
              component={route.component}
              key={idx}
            />
          ))}

 {userRoutes.map((route, idx) => (
	             <PrivateRoute
	               path={route.path}
	               layout={Layout}
	               component={route.component}
	               key={idx}
	               exact
	             />
	           ))}

        </Switch>
      </Router>
    </React.Fragment>
  )
}

App.propTypes = {
  layout: PropTypes.any
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  }
}

export default connect(mapStateToProps, null)(App)
