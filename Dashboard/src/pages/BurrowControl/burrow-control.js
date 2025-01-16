import React from "react"

import img8 from "../../assets/images/burrow.png"
import { Link } from "react-router-dom"
import { ROS } from './ROS'
import ShowROSDevices from './ShowROSDevices'
import {
  Col,
  Button,
  Row,
  Card,
  CardBody,
  Table,
  CardTitle,
  CardSubtitle,
  CardImg,
  CardText,
  Container,
} from "reactstrap"
import avatar1 from "../../assets/images/users/avatar-1.jpg"
import avatar2 from "../../assets/images/users/avatar-2.jpg"
import avatar3 from "../../assets/images/users/avatar-3.jpg"
import avatar4 from "../../assets/images/users/avatar-4.jpg"
import avatar5 from "../../assets/images/users/avatar-5.jpg"
import avatar6 from "../../assets/images/users/avatar-6.jpg"

//Import Breadcrumb

const BurrowControl = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
       
          <Row>
            <Col>
              <Card>
                <CardBody>
	              <ROS>
	                  <ShowROSDevices/>
	              </ROS>
                </CardBody>
              </Card>
	    </Col>
          </Row>

        </Container>
      </div>
    </React.Fragment>
  )
}

export default BurrowControl 
