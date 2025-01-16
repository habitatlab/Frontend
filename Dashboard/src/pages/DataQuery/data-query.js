import React, {useEffect, useRef,  useState} from 'react';

import { connect } from "react-redux"
import { submitQuery } from "../../store/query/actions"
import { Card, CardBody, Button, Label, Table, Input, FormGroup, CardSubtitle, CardTitle, Col, Container, Row } from "reactstrap"
import h337 from 'heatmap.js';
import { motion } from 'framer-motion';


const DataQuery = props => {
   const { onSubmitQuery, results, history } = props
   const  [video, setVideo] = useState([])
   const  [tracking, setTracking] = useState([])
    const [startDate, setStartDate] = useState()
    const [formatResults, setFormatResults] = useState({})
    const [endDate, setEndDate] = useState()
    const [ephys_filter, setEphysFilter] = useState()
    const [video_filter, setVideoFilter] = useState(true)
    const [pose_filter,setPoseFilter] = useState()
    const [tracking_filter, setTrackingFilter] = useState()
    const containerRefs = useRef({});
    const [renderTrigger, setRenderTrigger] = useState(0);
    const heatmapRefs = useRef({});

 function calculateHourlyOffsets(startTime, endTime, hourlyBoxes) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Calculate the minutes in the first partial hour (if applicable)
  let startMinutesLeft = 60 - start.getMinutes();  // Minutes left in the start hour
  let startHour = new Date(start.getTime());
  startHour.setMinutes(0, 0, 0);  // Set start hour to the beginning of the hour

  // Handle the first hour case
  if (startHour.getTime() + 60 * 60000 >= end.getTime()) {
    // If the start and end times are in the same hour
    const hourBox = `${startHour.getUTCFullYear()}-${(startHour.getUTCMonth() + 1).toString().padStart(2, '0')}-${startHour.getUTCDate().toString().padStart(2, '0')} ${startHour.getUTCHours().toString().padStart(2, '0')}:00`;

    if (hourlyBoxes[hourBox]) {
      hourlyBoxes[hourBox].minutes = (end.getTime() - start.getTime()) / 60000;
    }
    return;
  } else {
    // Add the remaining minutes in the first hour
    const firstHourBox = `${startHour.getUTCFullYear()}-${(startHour.getUTCMonth() + 1).toString().padStart(2, '0')}-${startHour.getUTCDate().toString().padStart(2, '0')} ${startHour.getUTCHours().toString().padStart(2, '0')}:00`;

    if (hourlyBoxes[firstHourBox]) {
      hourlyBoxes[firstHourBox].minutes = startMinutesLeft;
    }
  }

  // Move to the next hour after start
  let currentHour = new Date(start.getTime() + startMinutesLeft * 60000);

  // Calculate the full 60-minute hours between start and end
  while (currentHour.getTime() + 60 * 60000 <= end.getTime()) {
    const hourBox = `${currentHour.getUTCFullYear()}-${(currentHour.getUTCMonth() + 1).toString().padStart(2, '0')}-${currentHour.getUTCDate().toString().padStart(2, '0')} ${currentHour.getUTCHours().toString().padStart(2, '0')}:00`;

    if (hourlyBoxes[hourBox]) {
      hourlyBoxes[hourBox].minutes = 60;
    }

    currentHour.setHours(currentHour.getHours() + 1); // Move to next hour
  }

  // Calculate the minutes in the final partial hour
  const finalHourBox = `${currentHour.getUTCFullYear()}-${(currentHour.getUTCMonth() + 1).toString().padStart(2, '0')}-${currentHour.getUTCDate().toString().padStart(2, '0')} ${currentHour.getUTCHours().toString().padStart(2, '0')}:00`;

  const finalMinutes = (end.getTime() - currentHour.getTime()) / 60000;
  if (finalMinutes > 0 && hourlyBoxes[finalHourBox]) {
    hourlyBoxes[finalHourBox].minutes = finalMinutes;
  }
}


 useEffect(() => {
     var animals = ['mouse1', 'mouse2', 'mouse3', 'mouse4', 'mouse5', 'mouse6'];

    if (results.tracking && results.tracking.length>0) {
var formatResults = {}
let pixels_per_centimeter = 13.07; // Replace with actual value
    var timeDiff = new Date(endDate).getTime() - new Date(startDate).getTime();
	var totalFrames = 20*timeDiff/1000;

animals.forEach(animal => {
const hourlyBoxes = {};
	for (let d = new Date(startDate+"Z"); d <= new Date(endDate + "Z"); d.setHours(d.getHours() + 1)) {
    const hourBox = `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, '0')}-${d.getUTCDate().toString().padStart(2, '0')} ${d.getUTCHours().toString().padStart(2, '0')}:00`;
    // Initialize each hour box with an empty array
    hourlyBoxes[hourBox] = [];
  }

    calculateHourlyOffsets(startDate + "Z", endDate + "Z", hourlyBoxes)
    console.log(hourlyBoxes)
   const filteredResults = results.tracking.filter(tracking => tracking.animal === animal);
   var numtrackinganimal = filteredResults.length * 240;
   console.log ("For animal " + animal + " tracked locations are " + numtrackinganimal);
   filteredResults.forEach(tracking => {
        var times = [];
        var dates = [];
        var velocities = [];

        var clean_box_x = [];
        var clean_box_y = [];
        var locations = tracking.locations;

    let prev_x = locations[0].center_x;
    let prev_y = locations[0].center_y;
    let prev_timestamp = new Date(locations[0].timestamp);  // Convert timestamp to Date object

   locations.forEach(box => {
        const distx = box.center_x - prev_x;
        const disty = box.center_y - prev_y;
        const dist_pixels = Math.sqrt(Math.pow(distx, 2) + Math.pow(disty, 2));

        const box_timestamp = new Date(box.timestamp);  // Convert timestamp to Date object
        const time_diff = (box_timestamp - prev_timestamp) / 1000;  // Difference in seconds

		const hourBox = `${box_timestamp.getUTCFullYear()}-${(box_timestamp.getUTCMonth() + 1).toString().padStart(2, '0')}-${box_timestamp.getUTCDate().toString().padStart(2, '0')} ${box_timestamp.getUTCHours().toString().padStart(2, '0')}:00`;
		if (hourlyBoxes[hourBox] && time_diff !== 0) {
            const vel_pixels_sec = dist_pixels / time_diff;
            const vel_centimeters_sec = vel_pixels_sec / pixels_per_centimeter;
            if (vel_centimeters_sec <= 200.0) {
                hourlyBoxes[hourBox].push({
                    "timestamp": box.timestamp,
                    "velocity": vel_centimeters_sec,
                    "x": box.center_x,
                    "y": box.center_y,
                    "distance": dist_pixels/pixels_per_centimeter
                });
            }
		}

        prev_x = box.center_x;
        prev_y = box.center_y;
        prev_timestamp = box_timestamp;
    });

});
   formatResults[animal] = {}
   for (var hour in hourlyBoxes) {
       const animalPath = hourlyBoxes[hour].reduce((acc, point, index) => {
           if (index === 0) {
               return `M ${point.x},${point.y}`;
           }

           const prevPoint = hourlyBoxes[hour][index - 1];
           const timeDifference = new Date(point.timestamp).getTime() - new Date(prevPoint.timestamp).getTime()

           return timeDifference > 1000
               ? `${acc} M ${point.x},${point.y}` // Move to a new position without drawing a line
               : `${acc} L ${point.x},${point.y}`; // Draw a line for connected points
       }, '');

	    const totalVelocity = hourlyBoxes[hour].reduce((acc, entry) => acc + entry.velocity, 0);
        const averageVelocity = totalVelocity / hourlyBoxes[hour].length;
        const totaldistance =  hourlyBoxes[hour].reduce((acc, entry) => acc + entry.distance, 0);
        const locationCounts = hourlyBoxes[hour].reduce((acc, { x, y }) => {
           const key = `${x}-${y}`;
           acc[key] = (acc[key] || 0) + 1; // Increment count for each (x, y) point
           return acc;
        }, {});
       const coverage = hourlyBoxes[hour].length/(1200*hourlyBoxes[hour].minutes)

       formatResults[animal][hour] = {
           "totdist":totaldistance,
           "avgVelocity": averageVelocity,
           "animalPath": animalPath,
           "locationCounts": locationCounts,
           "coverage": coverage*100
       }
   }
});
    setFormatResults(formatResults)
    }
  }, [results])

    useEffect(() => {
        if (!formatResults) return;

        // Define the original size and canvas size for scaling
        const originalWidth = 2000; // Original width of the data grid
        const originalHeight = 2000; // Original height of the data grid
        const canvasWidth = 200; // Target canvas width
        const canvasHeight = 200; // Target canvas height

        // Calculate scaling factors for rebinning
        const xScalingFactor = originalWidth / canvasWidth;
        const yScalingFactor = originalHeight / canvasHeight;

        // Iterate through each animal and hour combination in formatResults
        Object.keys(formatResults).forEach((animal) => {
            Object.keys(formatResults[animal]).forEach((hour) => {
                const heatmapKey = `${animal}-${hour}`;
                const container = containerRefs.current[heatmapKey]; // Get the container ref

                if (container) {
                    // Create a heatmap instance only if it doesn't exist yet
                    if (!heatmapRefs.current[heatmapKey]) {
                        heatmapRefs.current[heatmapKey] = h337.create({
                            container,
                            radius: 15,
                            maxOpacity: 0.6,
                            gradient: {
                                0.2: 'blue',
                                0.4: 'cyan',
                                0.6: 'yellow',
                                0.8: 'orange',
                                1.0: 'red',
                            },
                        });
                    }

                    // Get `locationCounts` from formatResults
                    const locationCounts = formatResults[animal][hour].locationCounts;

                    // Step 1: Create a new re-binned structure for the location counts
                    const binnedLocationCounts = {};

                    // Step 2: Iterate through each `locationCounts` entry and re-bin
                    Object.entries(locationCounts).forEach(([key, value]) => {
                        const [x, y] = key.split('-').map(Number);

                        // Map the original x, y to new bin positions based on scaling factors
                        const binX = Math.floor(x / xScalingFactor);
                        const binY = Math.floor(y / yScalingFactor);
                        const binKey = `${binX}-${binY}`;

                        // Aggregate the values for the new bin
                        binnedLocationCounts[binKey] = (binnedLocationCounts[binKey] || 0) + value;
                    });

                    // Step 3: Format the re-binned data for Heatmap.js
                    const formattedHeatmapData = {
                        max: Math.max(...Object.values(binnedLocationCounts)), // Calculate the new max value
                        data: Object.entries(binnedLocationCounts).map(([key, value]) => {
                            const [binX, binY] = key.split('-').map(Number);
                            return { x: binX, y: binY, value }; // Format the new binned data for Heatmap.js
                        }),
                    };

                    // Set the binned data for the heatmap instance
                    heatmapRefs.current[heatmapKey].setData(formattedHeatmapData);
                }
            });
        });
    }, [formatResults]); // Depend on `formatResults` for re-running the effect



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

          <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Animal</th>
            {/* Dynamically create table headers using the first animal's hours */}
            {formatResults && Object.keys(formatResults).length > 0 &&
              Object.keys(formatResults[Object.keys(formatResults)[0]]).map(hour => (
                <th key={hour}>{hour}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {/* Loop through each animal in formatResults */}
          {Object.keys(formatResults).map(animalKey => (
            <tr key={animalKey}>
              <td>{animalKey}</td>
              {/* For each animal, loop through its hourly data */}
              {Object.keys(formatResults[animalKey]).map(hourKey => (
                <td key={hourKey}>
                  <Row>
                    <Col><strong>Total Distance:</strong></Col>
                    <Col>{formatResults[animalKey][hourKey].totdist.toFixed(2)}</Col>
                  </Row>
                  <Row>
                    <Col><strong>Avg Velocity:</strong></Col>
                    <Col>{formatResults[animalKey][hourKey].avgVelocity.toFixed(2)}</Col>
                  </Row>
                  <Row>
                    <Col><strong>Coverage:</strong></Col>
                    <Col>{formatResults[animalKey][hourKey].coverage.toFixed(2)}%</Col>
                  </Row>
                   <Row><Col>
                    <div
                        key={`${animalKey}-${hourKey}`}
                        ref={(el) => (containerRefs.current[`${animalKey}-${hourKey}`] = el)} // Attach container ref
                        style={{
                            width: '200px',
                            height: '200px',
                            margin: '10px',
                            border: '1px solid #ddd',
                            position: 'relative',
                        }}
                    />
                   </Col>
                       <Col>
                           <svg width="200" height="200" style={{ border: '1px solid #ddd' }}>
                               {/* Animated path */}
                               <motion.path
                                   d={formatResults[animalKey][hourKey].animalPath}
                                   fill="none"
                                   stroke="black"
                                   strokeWidth="4"
                                   transform="scale(0.1)"
                                   initial={{ pathLength: 0 }}
                                   animate={{ pathLength: 1 }}
                                   transition={{ duration: 50, ease: 'easeInOut' }}
                               />
                           </svg>
                       </Col>
                   </Row>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

	     {video.map((result, idx) => (
                 <Row style={{ paddingBottom: '10px'}}>
                    <Col md={3}>
                  <div>
		     <a href={"http://schauderd-ws2:5001/"+result.location}>
                         <img width="200" src={"http://schauderd-ws2:5001/"+result.thumb}/></a>
                  </div>
                     </Col>
		     <Col md={9}>
		     <Row>
		          <a href={"http://schauderd-ws2:5001/"+result.location}>Download</a>
                     </Row>
	   <Row>
	  	        <b>Start Timestamp: {result.timestamp} </b>  
		</Row>
		      <Row>
                        <b>Camera: </b> {result.camera}
                    </Row>
                     <Row>
                        <b>Number Of Frames: </b> {result.duration}
                    </Row>
                      <Row>
                        <b>FPS: </b> {result.fps}
                    </Row>
		     <Row>
		        <b>Frame Dimensions: </b> {result.width} x {result.height}
	            </Row>
		     <Row>
                        <b>Mouse Activity: </b> {result.tracking && result.tracking['mouse1']}
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
   return ({
      results: dataquery.results,
      
  })
}


const mapDispatchToProps = dispatch => ({
  onSubmitQuery: (query) => dispatch(submitQuery(query)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DataQuery)


