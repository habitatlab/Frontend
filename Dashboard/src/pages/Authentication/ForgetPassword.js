import PropTypes from 'prop-types'
import { Row, Col, Alert, Card, CardBody, Container } from "reactstrap"
import React, { useState } from "react"
// Redux
import { connect } from "react-redux"
import { withRouter, Link } from "react-router-dom"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

// action
import { userForgetPassword, userChangePassword } from "../../store/actions"

// import images
import profile from "../../assets/images/profile-img.png"
import logo from "../../assets/images/logo.svg"

const ForgetPasswordPage = props => {
  const { onUserForgetPassword, onUserChangePassword } = props
  const [user, setUser] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [code, setCode] = useState()
  const [codeSent, setCodeSent] = useState(false)

  function handleResetSubmit() {
    console.log(user)
    onUserForgetPassword(user)
    setCodeSent(true)
  }

  function handleCodeSubmit() {
    onUserChangePassword(user,code,password)
    setCodeSent(false)
    props.history.push("/login")
  }

  return (
      <React.Fragment>
        <div className="home-btn d-none d-sm-block">
          <Link to="/" className="text-dark">
            <i className="fas fa-home h2"/>
          </Link>
        </div>
        <div className="account-pages my-5 pt-sm-5">
          <Container>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="overflow-hidden">
                  <div className="bg-soft-primary">
                    <Row>
                      <Col className="col-7">
                        <div className="text-primary p-4">
                          <h5 className="text-primary">Reset Password</h5>
                          <p>Enter in your user to get a code sent to your email to reset your password.</p>
                        </div>
                      </Col>
                      <Col className="col-5 align-self-end">
                        <img src={profile} alt="" className="img-fluid" />
                      </Col>
                    </Row>
                  </div>
                  <CardBody className="pt-0">
                    <div>
                      <Link to="/">
                        <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                              src={logo}
                              alt=""
                              className="rounded-circle"
                              height="34"
                          />
                        </span>
                        </div>
                      </Link>
                    </div>
                    <div className="p-2">
                      {props.forgetError && props.forgetError ? (
                          <Alert color="danger" style={{ marginTop: "13px" }}>
                            {props.forgetError}
                          </Alert>
                      ) : null}
                      {props.forgetSuccessMsg ? (
                          <Alert color="success" style={{ marginTop: "13px" }}>
                            {props.forgetSuccessMsg}
                          </Alert>
                      ) : null}

                      {!codeSent ? (
                          <AvForm
                              className="form-horizontal mt-4"
                          >
                            <div className="form-group">
                              <AvField
                                  name="user"
                                  label="User"
                                  className="form-control"
                                  type="text"
                                  onChange={e => setUser(e.target.value)}
                                  required
                              />
                            </div>
                            <Row className="form-group">
                              <Col className="text-right">
                                <button
                                    className="btn btn-primary w-md waves-effect waves-light"
                                    type="button"
                                    onClick={() => handleResetSubmit()}
                                >
                                  Reset
                                </button>
                              </Col>
                            </Row>
                          </AvForm>) : null}


                      {codeSent ? (
                          <AvForm
                              className="form-horizontal mt-4"
                          >
                            <div className="form-group">
                              <AvField
                                  name="code"
                                  label="Code"
                                  className="form-control"
                                  type="text"
                                  onChange={e => setCode(e.target.value)}
                                  required
                              />
                            </div>
                            <div className="form-group">
                              <AvField
                                  name="newPassword"
                                  label="New Password"
                                  className="form-control"
                                  type="password"
                                  onChange={e => setPassword(e.target.value)}
                                  required
                              />
                            </div>
                            <Row className="form-group">
                              <Col className="text-right">
                                <button
                                    className="btn btn-primary w-md waves-effect waves-light"
                                    type="button"
                                    onClick={() => handleCodeSubmit()}
                                >
                                  Confirmation Code
                                </button>
                              </Col>
                            </Row>
                          </AvForm>) : null}



                    </div>
                  </CardBody>
                </Card>
                <div className="mt-5 text-center">
                  <p>
                    Go back to{" "}
                    <Link to="login" className="font-weight-medium text-primary">
                      Login
                    </Link>{" "}
                  </p>
                  <p>
                    © {new Date().getFullYear()} Skote. Crafted with{" "}
                    <i className="mdi mdi-heart text-danger"/> by Themesbrand
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
  )
}

ForgetPasswordPage.propTypes = {
  forgetError: PropTypes.any,
  forgetSuccessMsg: PropTypes.any,
  history: PropTypes.object,
  userForgetPassword: PropTypes.func,
  userChangePassword: PropTypes.func
}

const mapStatetoProps = state => {
  const { forgetError, forgetSuccessMsg } = state.ForgetPassword
  return { forgetError, forgetSuccessMsg }
}


const mapDispatchToProps = dispatch => ({
  onUserForgetPassword: user => dispatch(userForgetPassword(user)),
  onUserChangePassword: (user,code,password) => dispatch(userChangePassword(user,code,password))
})

export default withRouter(
    connect(mapStatetoProps, mapDispatchToProps)(ForgetPasswordPage)
)
