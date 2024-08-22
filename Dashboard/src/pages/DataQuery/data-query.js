import React, {useEffect, useState} from 'react';

import { connect } from "react-redux"
import { submitQuery } from "../../store/query/actions"
import { Card, CardBody, Button, Label, Input, FormGroup, CardSubtitle, CardTitle, Col, Container, Row } from "reactstrap"

const DataQuery = props => {
   const { onSubmitQuery, results, history } = props
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [ephys_filter, setEphysFilter] = useState()
    const [video_filter, setVideoFilter] = useState(true)
    const [pose_filter,setPoseFilter] = useState()
    const [tracking_filter, setTrackingFilter] = useState()

 useEffect(() => {
    console.log("ASDFASDF")
  }, [results])


  function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay; 
 }

 function updateStartDate(newDate) {
   console.log(newDate);
   setStartDate(newDate)
 }

 function updateEndDate(newDate) {
   console.log(newDate); 
   setEndDate(newDate)
 }

 function submitQuery() { 
     var query = {startDate: startDate, endDate: endDate}
     console.log(query)
     onSubmitQuery(query)
  }

  function downloadTimestamps(timestamps) {
     console.log("Downloading timestamps");
  }

	

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <CardTitle>Specify your query for retrieving rat burrow data archives</CardTitle>
	          <Row>
	             <Col md={3}>
	               <FormGroup>
	                      <Label>
	                        Start Date/Time
	                      </Label>
	     <input
	                          className="form-control"
	                          type="datetime-local"
	                          value={startDate}
	                           onChange={(evt) => {updateStartDate(evt.target.value)}}
	                        />
	                 </FormGroup>
	              </Col>
 <Col md={3}>
	                         <FormGroup>
	                                <Label>
	                                  End Date/Time
	                                </Label>
	               <input
	                                    className="form-control"
	                                    type="datetime-local"
	                                    value={endDate}
	                                    onChange={(evt) => {updateEndDate(evt.target.value)}}
	                                  />
	                           </FormGroup>
	                        </Col>
	              <Col md={6}>
	                 <Row>
	              <Col md={1}></Col>
	              <Col md={3}>
	  <FormGroup>
	 <input
	                              className="form-check-input"
	                              type="checkbox"
	                              value="{ephys_filter}"
	                            />
	                            <label
	                              className="form-check-label"
	                              htmlFor="defaultCheck1"
	                            >
	                              Ephys Data
	                            </label>
	                        </FormGroup>
	   
	               </Col>
	               <Col md={3}>
	                        <FormGroup>
	                             <input
	                              className="form-check-input"
	                              type="checkbox"
	                              value="{video_filter}"
	                            />
	                            <label
	                              className="form-check-label"
	                              htmlFor="defaultCheck2"
	                            >
	                              Video data
	                            </label>
	                         </FormGroup>
	               </Col>
 <Col md={5}>
	                                  <FormGroup>
	                                       <input
	                                        className="form-check-input"
	                                        type="checkbox"
	                                        value="{pose_filter}"
	                                      />
	                                      <label
	                                        className="form-check-label"
	                                        htmlFor="defaultCheck2"
	                                      >
	                                        Pose estimation data
	                                      </label>
	                                   </FormGroup>
	                         </Col>
	                 </Row>
	                <Row>
	                   <Col md={1}></Col>
	                        <Col md={3}>
	            <FormGroup>
	           <input
	                                        className="form-check-input"
	                                        type="checkbox"
	                                        value="{tracking_filter}"
	                                      />
	                                      <label
	                                        className="form-check-label"
	                                        htmlFor="defaultCheck1"
	                                      >
	                                        Tracking Data
	                                      </label>
	                                  </FormGroup>

	                         </Col>
	                  </Row>
	               </Col>
	          </Row>
	   <Row>
	              <Col md={12}>
	                 <Button
	                                            color="primary"
	                                            className="btn btn-primary waves-effect waves-light"
	                                           onClick={(e) => {
                              submitQuery()
                            }}
	                                          >Submit Query</Button>
	              </Col>
	            </Row>
                </CardBody>
	      </Card>
	    </Col>
	  </Row>
	  <Row>
	     <Col lg={12}>
	      <Card>
	         <CardBody>
	           <CardTitle>Results</CardTitle>
	     {results.map((result, idx) => (
                 <Row style={{ paddingBottom: '10px'}}>
                    <Col md={3}>
                  <div>
		     <a href={"<file server url>"+result.location}>
                         <img width="200" src={"<file server url>"+result.thumb}/></a>
                  </div>
                     </Col>
		     <Col md={9}>
		     <Row>
		          <a href={"<file server url>"+result.location}>Right-click to download</a>
                     </Row>
	   <Row>
		     <Col>
	  	        <b>Start Timestamp:</b>
		     </Col>
		     <Col>
		        {new Date(result.timestamp).toString()}
		     </Col>
		</Row>
                     <Row>
		        <Col>
                           <b>Video Duration: </b>
		        </Col>
		        <Col>
		           {secondsToHms(result.duration/result.fps)}
		        </Col>
                    </Row>
                      <Row>
		        <Col>
                        <b>FPS: </b>
		         </Col>
		         <Col>
		           {result.fps}
		         </Col>
                    </Row>
		     <Row>
		        <Col>
		           <b>Dimensions: </b>
		        </Col>
		        <Col>
		          {result.width} x {result.height}
		        </Col>
	            </Row>
		     </Col>
		   </Row>
	     ))}
                </CardBody>
              </Card>
            </Col>
          </Row>

        </Container>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = ({ dataquery }) => {
  const sortedResults = dataquery.results.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1);
   return ({
      results: sortedResults,
  })
}


const mapDispatchToProps = dispatch => ({
  onSubmitQuery: (query) => dispatch(submitQuery(query)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DataQuery)


