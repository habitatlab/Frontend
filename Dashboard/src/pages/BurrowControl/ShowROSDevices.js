import React, { useState, useRef, useEffect } from 'react'
import { useROS, getTopics, changeUrl } from './ROS'
import { connect } from "react-redux"
import { fetchDiagnostics } from "../../store/devicecontrol/actions"
import ReactApexChart from "react-apexcharts"
import ROSLIB from 'roslib'
import {
  Col,
  Button,
  Row,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Card,
  CardBody,
  Table,
  CardTitle,
  CardSubtitle,
  CardImg,
  CardText,
  Container,
} from "reactstrap"

const ShowROSDevices = props => {
  const imageRef = useRef({});

  const { onGetDiagnosticResults, diagnostic_results } = props
  const { createListener, createPublisher, isConnected, url, topics, toggleConnection, toggleAutoconnect, changeUrl } = useROS();
  const [ topic, setTopic ] = useState('/devices_heartbeat');
  const [ archiveTopic, setArchiveTopic ] = useState('/archive_actions');
  const [ previewTopic, setPreviewTopic ] = useState('/camera_feeds');
  const [ queue, setQueue ] = useState(0);
  const [ devices, setDevices ] = useState([]);
  const [ foobar, setFooBar ] = useState({});
  const [ refMap, setRefMap] = useState(new Map());
  const [ publisher, setPublisher ] = useState(null);
  const [ listener, setListener ] = useState(null);
  const [ previewListener, setPreviewListener ] = useState(null);
  const [ archiver, setArchiver ] = useState(null);
  const [ analyzer, setAnalyzer ] = useState(null);
  const [ selected, setSelected ] = useState([]);
  const [ liveFeed, setLiveFeed ] = useState(false)
  const [ currCamera, setCurrCamera ] = useState()
  const [ compression, setCompression ] = useState('none');
  const [ diagnostic, setDiagnostic ] = useState("")
  const [ currCameraInfo, setCurrCameraInfo] = useState({})
  const [ diagnosticframes, setDiagnosticFrames ] = useState()
  const [ diagnosticResultData, setDiagnosticResultData ] = useState([])
  const [ archiverEvents, setArchiverEvents ] = useState({})
  const [ showDiagnosticResults, setShowDiagnosticResults ] = useState(false)
  const [ editSettings, setEditSettings ] = useState(false)
  const [ gain, setGain ] = useState()
  const [ exposure, setExposure ] = useState()
  const [ basename, setBasename ] = useState()

  var deviceMap = []

  // Try replacing this with your own unique rosbridge webserver address
  const defaultURL = "ws://rosbridge.com:9090";

  var options = {
              chart: {
                height: 350,
                type: 'line',
                zoom: {
                  enabled: false
                }
              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                curve: 'straight'
              },
              yaxis: {
                title: {
                  text: 'Diff between timestamps (nanoseconds)'
                },
              },
            
            };
            
         
	
  // only runs once when ToggleConnect is first rendered (mounted)
  useEffect(() => {
     if (topics) {
	     if (!listener) {
             for (var i in topics) {
                 if (topics[i].path == topic) {
                     var nlistener = createListener( topics[i].path,
                        topics[i].msgType,
                        Number(queue),
                        compression);
		             setListener(nlistener)
                 }
                 if (topics[i].path == previewTopic) {
                     var plistener = createListener( topics[i].path,
                            topics[i].msgType,
                            Number(queue),
                            compression);
                      setPreviewListener(plistener)
                 }
                 if (topics[i].path == archiveTopic) {
                     var alistener = createListener( topics[i].path,
                            topics[i].msgType,
                            Number(queue),
                            compression);
                      setArchiver(alistener)
                 }
             }
        }
	 
	 if (nlistener) {
             console.log("Subscribing to messages...");
             nlistener.subscribe(pollDevices);
         }

          if (alistener) {
             console.log("Subscribing to archive actions...");
             alistener.subscribe(processArchiveEvents);
         } 
	    if (plistener) {
             console.log ("Subscribing to preview frames...");
             plistener.subscribe(previewCameraFrames);
        }
	 if (!publisher) {
		 var npublisher = createPublisher ( "/device_control",
		  'std_msgs/String');
         if (npublisher) {
	     console.log("Set up Publisher for Device Control....");
	     setPublisher(npublisher)
	 }
         }

      }
  }, [topics, devices])

  useEffect(() => {
    if (diagnostic_results) {
      var diagnostic_json;
      var ptp = false
      if (!diagnostic_results["json"].constructor==Array)
          diagnostic_json = JSON.parse(diagnostic_results["json"].replaceAll(",\n]","]").replaceAll("\n",""));
      else {
          diagnostic_json = diagnostic_results["json"];
          ptp = true
      }

      var ndata =  {
                name: diagnostic_results["camera"],
                data: []}
     var frame_drops = 0;
     var frame_count = 0;
     for (var i=0; i<diagnostic_json.length; i++) {
          if (i>0) {
            frame_count++;
            if (ptp) {
                ndata.data.push({
                   "x": diagnostic_json[i].cam_frame_time,
                   "y": diagnostic_json[i].cam_frame_time-diagnostic_json[i-1].cam_frame_time
               })
            } else {
                ndata.data.push({
                   "x": diagnostic_json[i].frame_time,
                   "y": diagnostic_json[i].frame_time-diagnostic_json[i-1].frame_time
               })
            }
            if (diagnostic_json[i].cam_frame_time-diagnostic_json[i-1].cam_frame_time>30000000) {
                frame_drops++;
            }
        }
     }

     var existingData = false
     for (var i=0; i<diagnosticResultData.length; i++) {
         if (diagnosticResultData[i].name==diagnostic_results["camera"]) {
            diagnosticResultData[i].data = diagnosticResultData[i].data.concat (ndata.data)
            diagnosticResultData[i].frame_drops = diagnosticResultData[i].frame_drops + frame_drops
            diagnosticResultData[i].frame_count = diagnosticResultData[i].frame_count + frame_count
            existingData = true
         }
     }
     if (!existingData) {
         ndata.frame_drops = frame_drops
         ndata.frame_count = frame_count
         diagnosticResultData.push (ndata)
     }
       setDiagnosticResultData (diagnosticResultData)

       archiverEvents[diagnostic_results["camera"]] = diagnostic_results["location"]
       setArchiverEvents(archiverEvents)
    }

  }, [diagnostic_results])



  const pollDevices = (msg) => {
     var msgObj = JSON.parse(msg.data)
     if (msgObj["camera"]) {
	     deviceMap[msgObj["camera"]] = msgObj 
     }
     var ldevices = [];
     for (var k in deviceMap) ldevices.push(deviceMap[k]);
     setDevices(ldevices)
  }

    const previewCameraFrames = (msg) => { 
      if (imageRef.current[msg.header.frame_id]) {
	  imageRef.current[msg.header.frame_id].src = "data:image/jpg;base64," + msg.data
      }
  }

 const processDiagnostic = (msg) => {
     var msgObj = JSON.parse(msg.data)
  }

  const processArchiveEvents = (msg) => {
     var msgObj = JSON.parse(msg.data)
     if (deviceMap[msgObj["device"]].status=='Acquiring')
        return;
        
     var query = {
        "location": msgObj["basefile"]  + "_timestamp.json",
        "camera": msgObj["device"],
     }
     onGetDiagnosticResults(query)
  }

  function viewDiagnosticResults(camera_id) {
     setShowDiagnosticResults(true)

  }

 function clearDiagnosticData() {
       setDiagnosticResultData ([])
  }

   function hideDiagnostics() {
       setShowDiagnosticResults (false)
  }

  function setSelectedDevices(checked, index) {
      const found = selected.indexOf(index);
      if (checked) {
        if (found == -1) {
	   selected.push(index);
	}
     } else {
        if (found > -1) {
	   selected.splice(index, 1)
        } 
     }
     setSelected(selected)
  }

  function startPTPSync() {
     var latestPTPTime = 0;
     for (var i=0; i<selected.length; i++) {
	 var device = devices[selected[i]]
         if (parseInt(device.timestamp)>latestPTPTime) 
	     latestPTPTime = parseInt(device.timestamp);
     }

     for (var i=0; i<selected.length; i++) {
	 var msgObj = {
             deviceId: devices[selected[i]].camera,
             action: "Start",
             ptpTime: (latestPTPTime+15000000000).toString() // start cameras in 3 second future time
         };
         var serializedMsg = JSON.stringify(msgObj);
         var rosMsg = new ROSLIB.Message({
             data: serializedMsg
         });

         publisher.publish(rosMsg);
     }
  }

  function configurePTPSyncDiagnostic() {
     setDiagnostic("PTP")
     
  }

   function updateCamera(newParam, device) {
      var newValue;
      if (newParam=="gain") {
          newValue = gain;
      } else if (newParam=="exposure") {
	  newValue = exposure;
      } else if (newParam=="basename") {
	  newValue = basename;
      }
      var msgObj = {
          deviceId: device.camera,
	  property: newParam,
	  newValue: newValue,
          action: "Settings"
     };

     var serializedMsg = JSON.stringify(msgObj);
     var rosMsg = new ROSLIB.Message({
           data: serializedMsg
     });

     publisher.publish(rosMsg);


   }

    function setupCamera(device) {
       var msgObj = {
          deviceId: device.camera,
          action: "Preview"
     };

     var serializedMsg = JSON.stringify(msgObj);
     var rosMsg = new ROSLIB.Message({
           data: serializedMsg
     });

     publisher.publish(rosMsg);
     setGain(device.gain)
     setExposure(device.exposure)
     setBasename(device.basename)
     setEditSettings(true)
     
  }

  function startPTPSyncDiagnostic() {
    var latestPTPTime = 0;
     for (var i=0; i<selected.length; i++) {
     var device = devices[selected[i]]
         if (parseInt(device.timestamp)>latestPTPTime) 
         latestPTPTime = parseInt(device.timestamp);
     }

     for (var i=0; i<selected.length; i++) {
     var msgObj = {
             deviceId: devices[selected[i]].camera,
             action: "Diagnostic",
             numFrames: diagnosticframes,
             ptpTime: (latestPTPTime+15000000000).toString() // start cameras in 3 second future time
         };
         var serializedMsg = JSON.stringify(msgObj);
         var rosMsg = new ROSLIB.Message({
             data: serializedMsg
         });

         publisher.publish(rosMsg);
     }
     setDiagnostic("")
  }

   function stopPTPSync() {
     for (var i=0; i<selected.length; i++) {
         var msgObj = {
             deviceId: devices[selected[i]].camera,
             action: "Stop",
         };
         var serializedMsg = JSON.stringify(msgObj);
         var rosMsg = new ROSLIB.Message({
             data: serializedMsg
         });

         publisher.publish(rosMsg);
     }
  }

  function handleDiagnosticCamera(camera_id) {
      setDiagnostic("Basic")
      setCurrCamera(camera_id)
  }

  function startDiagnostic() {
     if (diagnostic=="PTP") {
          startPTPSyncDiagnostic()
          return;
     }

     var msgObj = {
          deviceId: currCamera,
          action: "Diagnostic",
          numFrames: diagnosticframes
     };

     var serializedMsg = JSON.stringify(msgObj);
     var rosMsg = new ROSLIB.Message({
           data: serializedMsg
     });

     publisher.publish(rosMsg);
     setDiagnostic("")
  }

  function handleStartCamera(camera_id) {
     var msgObj = {
          deviceId: camera_id,
          action: "Start"
     };

     var serializedMsg = JSON.stringify(msgObj);
     var rosMsg = new ROSLIB.Message({
           data: serializedMsg
     });

     publisher.publish(rosMsg);
  }

  function configureCameraSettings(camera_id) {
     var msgObj = {
          deviceId: camera_id,
          action: "Settings"
     };

     var serializedMsg = JSON.stringify(msgObj);
     var rosMsg = new ROSLIB.Message({
           data: serializedMsg
     });

     publisher.publish(rosMsg);
  }

  function handleStopCamera(camera_id) {
     var msgObj = {
          deviceId: camera_id,
          action: "Stop"
     };

     var serializedMsg = JSON.stringify(msgObj);
     var rosMsg = new ROSLIB.Message({
           data: serializedMsg
     });

     publisher.publish(rosMsg);

  }
  
  function closeFullScreen() {
    setLiveFeed(false)
  }

  function fullScreen(camera_id) {
    setCurrCamera(camera_id)
    setLiveFeed(true)
  }

  function endDiagnostics(camera_id) {
     handleStopCamera(camera_id)
  }

  useEffect(() => {
    if (url !== defaultURL) {
      changeUrl(defaultURL);
    }

    if (!isConnected) {
      toggleAutoconnect(); 
    }
  },[])

  useEffect(() => {
  },[devices])


  return (
    <div>
	  <p>
        <b>Synchronization with Pilot VBS:</b> { isConnected ? "Enabled" : "Disabled" }   <br />
          </p>
	    <Row>
	        <Col><span>Execute action on Cameras in sync</span> <Button
                                color="success"
                                className="btn btn-sm btn-primary waves-effect waves-light"
                                onClick={() => {
                                      startPTPSync()
                                        }}

                              >Sync Start</Button>
	                        <Button
                                color="error"
                                className="btn btn-sm btn-primary waves-effect waves-light"
                                onClick={() => {
                                      stopPTPSync()
                                        }}

                              >Sync Stop</Button>
                              <Button
                                color="secondary"
                                className="btn btn-sm btn-primary waves-effect waves-light"
                                onClick={() => {
                                      configurePTPSyncDiagnostic()
                                        }}

                              >Sync Diagnostic</Button>

	       </Col>
	    </Row>
	    <Row>
	        <Col><h6>Device</h6></Col>
                <Col><h6>Type</h6></Col>
                <Col><h6>Current State</h6></Col>
	        <Col><h6>Select</h6></Col>
                <Col md={2}><h6>Actions</h6></Col>
            </Row>
	   { devices.map((device, i) => 
              <Row>
		   <Col key={i}>{device.camera}</Col>
		   <Col>Camera</Col>
                   <Col>{device.status}</Col>
		   <Col><Input type="checkbox" onChange={(e)=>setSelectedDevices(e.target.checked, i)}/></Col>
                   {device.status=='Running Diagnostic' && <p>Running Diagnostic</p>}   {device.status=='Stopped' ? <Col md={3}><Button
                                color="success"
                                className="btn btn-sm btn-primary waves-effect waves-light"
                                onClick={() => {
                                      handleStartCamera(device.camera)
                                        }}

			      >Start Recording</Button>
            <Button
                                color="success"
                                className="btn btn-sm btn-primary waves-effect waves-light"
                                onClick={() => {
                                      setupCamera(device)
                                        }}

                              >Set Up Camera</Button>
                               <Button
                                color="success"
                                className="btn btn-sm btn-primary waves-effect waves-light"
                                onClick={() => {
                                      handleDiagnosticCamera(device.camera)
                                        }}

                              >Run Diagnostic</Button></Col> : <div/>}
                 {device.status=='Preview' && 
                  <Col md={6}><Row> <Col md={12}> <img ref={element => {
                        if (element) {
                             imageRef.current[device.camera] = element
		        }}} width="75%"/></Col></Row>
			<Row>
			   <Col>
	                        <Label>Gain</Label>
			   </Col>
		           <Col>
	                     <input type="range" min="-1" max="700" value={gain}
	                         onChange={event => {
                                     setGain(event.target.value);
                                 }}
			         onMouseUp={event => {
				    updateCamera ("gain", device)}} 
		                 id="myRange"/> 
			   </Col>
                           <Col>
                             <span>{gain}</span>
			   </Col>
		        </Row>
			 <Row>
                           <Col>
                                <Label>Exposure</Label>
                           </Col>
                           <Col>
                             <input type="range" min="1" max="20000" value={exposure}
                                 onChange={event => {
                                     setExposure(event.target.value);
                                 }}
			         onMouseUp={event => {
                                    updateCamera ("exposure",device)}}
                                 id="myRange"/>
                           </Col>
                           <Col>
                             <span>{exposure}</span>
                           </Col>
                        </Row>
		         <Row>
			    <Col>
				 <Label>Basename for Recording (Tube Test#1, etc.)</Label>
                                 <Input type="text" value={basename}  onChange={event => {
                                        setBasename(event.target.value);
                                       }}/>
                           </Col>
                         </Row>


	                  <Row style={{marginTop:"10px"}}>
                                  <Button
                                color="error"
                                className="btn btn-sm btn-primary waves-effect waves-light"
                                 onClick={() => {
                                      if (basename)
					 updateCamera("basename", device); 
				      handleStopCamera(device.camera)
                                        }}
                              >Finish Camera Setup</Button></Row> </Col>}

                       {device.status=='Acquiring' ?
                             <Col md={3}><Row>   <img ref={element => {
                        if (element) {
                             imageRef.current[device.camera] = element
                        }}} width="75%"/></Row> <Row style={{marginTop:"10px"}}>
                                  <Button
                                color="error"
                                className="btn btn-sm btn-primary waves-effect waves-light"
                                 onClick={() => {
                                      handleStopCamera(device.camera)
                                        }}
                              >Stop Camera</Button><Button
                                color="error"
                                className="btn btn-sm btn-primary waves-effect waves-light"
                                 onClick={() => {
                                      fullScreen(device.camera)
                                        }}
                              >Full Screen</Button></Row> </Col>: <div/>}

                {device.status=='Finished Diagnostic' && archiverEvents[device.camera] ?
                     <Col md={3}><Button
                                color="error"
                                className="btn btn-sm btn-primary waves-effect waves-light"
                     onClick={() => {
                                      viewDiagnosticResults(device.camera)
                                        }}
                              >View Results</Button>
                         <Button
                                color="success"
                                className="btn btn-sm btn-primary waves-effect waves-light"
                     onClick={() => {
                                      endDiagnostics(device.camera)
                                        }}
                              >End Diagnostics</Button></Col>
                               : <div/>}
                     </Row>
            )}
  
       {showDiagnosticResults ?
              <p>
                  <ReactApexChart options={options} series={diagnosticResultData} type="line" height={350} />
                    <Button
                                color="danger"
                                className="btn btn-sm btn-primary waves-effect waves-light"
                     onClick={() => {
                                      clearDiagnosticData()
                                        }}
                              >Clear Data</Button>      
                               <Button
                                color="info"
                                className="btn btn-sm btn-primary waves-effect waves-light"
                     onClick={() => {
                                      hideDiagnostics()
                                        }}
                              >Hide Diagnostics</Button>   
               { diagnosticResultData.map((results, i) => 
                    <Row>
                       <Col md={4}>
                        <h5>{results.name}</h5>
                       </Col>
                       <Col md={4}>
                        <h5>Total Drops: {results.frame_drops}</h5>
                        <h5>Total Frame: {results.frame_count}</h5>
                        <h5>Percentage Drops: {results.frame_drops*100.0/results.frame_count}</h5>
                        </Col>
                    </Row>
                    )}

              </p> : <div/>
}

<style jsx>{`
        .custom-modal .modal-dialog {
          max-width: 90%;
        }
      `}</style>

<Modal style={{maxWidth:"70%"}}  isOpen={liveFeed} toggle={() => {

 }}
  >
<ModalHeader tag="h4">
       <div>Live Feed for Camera Device {currCamera} <Button
                 onClick={e => {
                    closeFullScreen()
                 }}
                 color="#FFFFFF"
                 className="btn-sm"
                >
                     <i className="fas fa-window-close fa-2x" />
                </Button></div>
    </ModalHeader>
    <ModalBody>
	<img ref={element => {
                        if (element) {
                             imageRef.current[currCamera] = element
                        }}} width="100%"/>
    </ModalBody>
</Modal>

<Modal isOpen={diagnostic=="PTP" || diagnostic=="Basic"} toggle={() => {

 }}
  >
<ModalHeader tag="h4">
       Run Diagnostic on Camera Id: {currCamera} 
    </ModalHeader>
    <ModalBody>
    <Label>Enter number of frames for test</Label>
 <Input type="text"  onChange={event => {
                               setDiagnosticFrames(event.target.value);
                          }}/>

	  <Row>
              <Col md="4"/>
              <Col md="2">
                   <Button
                       onClick={e => { startDiagnostic()  }}
                       color="success"
                       className="btn-sm"
                    >
                     Start
                   </Button>
              </Col>
              <Col md="2">
                  <Button
                       onClick={e => { setDiagnostic("")  }}
                       color="primary"
                       className="btn-sm"
                    >
                     Cancel
                   </Button>
              </Col>
            </Row>
</ModalBody>
	  </Modal>


      </div>

  )
}



const mapStateToProps = ({ devicecontrol }) => {
   return ({
      diagnostic_results: devicecontrol.diagnostic_results,
  })
}


const mapDispatchToProps = dispatch => ({
  onGetDiagnosticResults: (query) => dispatch(fetchDiagnostics(query)),
})


export default connect(mapStateToProps, mapDispatchToProps)(ShowROSDevices);


