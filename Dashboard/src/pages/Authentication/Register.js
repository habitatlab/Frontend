import PropTypes from 'prop-types'
import React, { useEffect, useState } from "react"
import { Row, Col, CardBody, Card, Alert, Container } from "reactstrap"

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"

// action
import { registerUser, apiError, registerUserFailed, confirmEmail, confirmEmailFailed } from "../../store/actions"

// Redux
import { connect } from "react-redux"
import { Link } from "react-router-dom"

// import images
import profileImg from "../../assets/images/profile-img.png"
import logoImg from "../../assets/images/logo.svg"

const Register = props => {
  const [user, setUser] = useState()
  const [code, setCode] = useState()
  const [codeSent, setCodeSent] = useState(false)
  const [codeConfirmed, setCodeConfirmed] = useState(false)

  function handleConfirmEmail() {
       props.confirmEmail(user, code)
       setCodeConfirmed(true)
  }

  // handleValidSubmit
  function handleValidSubmit(event, values) {
    props.registerUser(values)
    setCodeSent(true)
  }

  useEffect(() => {
    props.registerUserFailed("")
  })

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
                        <h5 className="text-primary">Sage Register</h5>
                        <p>Sign up for SAGE here</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profileImg} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img
                            src={logoImg}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
	  {!codeSent ? (
		  <div className="p-2">
                    <AvForm
                      className="form-horizontal"
                      onValidSubmit={(e, v) => {
                        handleValidSubmit(e, v)
                      }}
                    >
                      {props.user && props.user ? (
                        <Alert color="success">
                          Register User Successfully
                        </Alert>
                      ) : null}
                      {props.registrationError && props.registrationError ? (
                        <Alert color="danger">{props.registrationError}</Alert>
                      ) : null}

                      <div className="form-group">
                        <AvField
                          name="email"
                          label="Email"
                          className="form-control"
                          placeholder="Enter email"
                          type="email"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <AvField
                          name="username"
                          label="Username"
                          type="text"
		          onChange={e => setUser(e.target.value)}
                          required
                          placeholder="Enter username"
                        />
                      </div>
                      <div className="form-group">
                        <AvField
                          name="password"
                          label="Password"
                          type="password"
                          required
                          placeholder="Enter Password"
                        />
                      </div>

                      <div className="mt-4">
                        <button
                          className="btn btn-primary btn-block waves-effect waves-light"
                          type="submit"
                        >
                          Register
                        </button>
                      </div>
		      <div className="mt-4 text-center">
		        <p className="mb-0">
		           By registering you agree to the Sage{" "}
		           <Link to="#" className="text-primary">
		              Terms of Use
		           </Link>
		        </p>
		      </div>
		  </AvForm>
              </div>
	  ) : null }
       
	  {codeSent ? (
		      <div className="p-2">
		        <AvForm
		            className="form-horizontal"
		            onValidSubmit={(e, v) => {
				    handleConfirmEmail(e, v)
			    }}
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
		        <div className="mt-4">
		            <button
		                className="btn btn-primary btn-block waves-effect waves-light"
		                type="submit"
		            >
		              Confirm Email
		            </button>
		        </div>
                        </AvForm>
                     </div>
             ) : null }
                </CardBody>
              </Card>
              <div className="mt-5 text-center">
                <p>
                  Already have an account ?{" "}
                  <Link to="/login" className="font-weight-medium text-primary">
                    {" "}
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

Register.propTypes = {
  registerUser: PropTypes.func,
  registerUserFailed: PropTypes.func,
  registrationError: PropTypes.any,
  confirmEmail: PropTypes.func,
  confirmEmailFailed: PropTypes.func,
  history: PropTypes.object,
  user: PropTypes.any
}

const mapStatetoProps = state => {
  const { user, registrationError, loading } = state.Account
  return { user, registrationError, loading }
}

export default connect(mapStatetoProps, {
  registerUser,
  apiError,
  registerUserFailed,
  confirmEmail,
  confirmEmailFailed
})(Register)
