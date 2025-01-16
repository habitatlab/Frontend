import PropTypes from 'prop-types'
import React, { useState, useEffect } from "react"
import {
  Table,
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  Alert,
  CardBody,
  Media,
  Button,
} from "reactstrap"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

// Redux
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb"

import avatar from "../../assets/images/users/avatar-1.jpg"
// actions
import { getProfile } from "../../store/actions"

const UserProfile = props => {
  const {user} = props
  const [email, setemail] = useState("")
  const [name, setname] = useState("")
  const { onGetProfile } = props
  useEffect(() => {
    if (localStorage.getItem("user")) {
      const username = localStorage.getItem("user")
      setname(username)
      const email = localStorage.getItem("email")
      setemail(email)
      onGetProfile(username)
    }
  }, [])

  function handleValidSubmit(event, values) {
    //props.editProfile(values)
  }

  function resetPassword() {
    props.history.push("/forgot-password")
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <Media>
                    <div className="mr-3">
                      <img
                        src={avatar}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      /><br/>
	              Change 
                    </div>
                    <Media body className="align-self-center">
                      <div className="text-muted">
	                <Table responsive striped className="mb-0">
	                  <tbody>
	                    <tr>
	                      <td>Username</td>
	                      <td>{name}</td>
	                    </tr>
	                    <tr>
	                      <td>Email</td>
	                      <td>{user.email}</td>
	                    </tr>
                            <tr>
	                      <td>Password</td>
	                      <td> <button
	                              className="btn btn-warning w-md waves-effect waves-light"
	                              type="button"
	                               onClick={() => resetPassword()}
	                            >
	                              Reset Password
	                            </button></td>
	                    </tr>
                            <tr>
	                      <td>Subscription Start Date</td>
	                      <td>{(user.subscription ? user.subscription.created : "")}</td>
	                    </tr>
                            <tr>
	                      <td>Subscription Renew Date</td>
	                      <td>{(user.subscription ? user.subscription.expires : "")}</td>
	                    </tr>
	                    <tr>
	                        <td></td>
	                        <td> <button
	                                  className="btn btn-warning w-md waves-effect waves-light"
	                                  type="button"
	                             >
	                               Update Subscription 
	                             </button>
	                       </td>
	                    </tr>
	                  </tbody>
	                </Table>
                      </div>
                    </Media>
                  </Media>
                </CardBody>
              </Card>
            </Col>
          </Row>

	  <Row>
	    <Col lg={6}>
	       <Card>
	             <CardBody>
	                 <CardTitle className="mt-0">
	                    Climate Info
	                 </CardTitle>
                         <Table responsive striped className="mb-0">
	                     <tbody>
	                        <tr>
	                          <td>Primary Zip Code</td>
	                          <td>{user.zipcode}</td>
	                        </tr>
	                        <tr>
	                          <td>Climate Classification (Koppen)</td>
	                          <td>{user.region_koppen}</td>
	                        </tr>
	                        <tr>
	                          <td>Climate Classification (USDA)</td>
	                          <td>{user.region_usda}</td>
	                        </tr>
	                     </tbody>
	                 </Table>
	             </CardBody>
	        </Card>
	     </Col>
             <Col lg={6}>
	        <Card>
	            <CardBody>
                        <CardTitle className="mt-0">
	                    Activity
	                </CardTitle>
	                <Table responsive striped className="mb-0">
	                    <tbody>
	                       <tr>
	                         <td>Last Logged In</td>
	                         <td>{user.activity ? user.activity.lastlogin : ""}</td>
	                       </tr>
	                       <tr>
	                         <td>Designs</td>
	                         <td>{user.activity ? user.activity.designs : ""}</td>
	                       </tr>
	                       <tr>
	                         <td>Coins</td>
	                         <td>{user.activity ? user.activity.coins : ""}</td>
	                       </tr>
	                    </tbody>
	                </Table>
	           </CardBody>
	       </Card>
	     </Col>
	  </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

UserProfile.propTypes = {
  onGetProfile: PropTypes.func,
  user: PropTypes.any,
  error: PropTypes.any,
  success: PropTypes.any
}

const mapStateToProps = state => {
  console.log(state.Profile.user)
  return {
     user: state.Profile.user
  }
}

const mapDispatchToProps = dispatch => ({
  onGetProfile: username => dispatch(getProfile(username)),
})

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps )(UserProfile)
)
