import React, { useEffect, useState, useRef } from "react";
import ReactSlider from 'react-slider';
import { v4 as uuidv4 } from 'uuid';
import {
    Collapse,
    Row,
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Card,
    CardHeader,
    CardBody,
    Container,
} from "reactstrap";
import { connect } from "react-redux";
import { io } from "socket.io-client";
import {getExperiments, getDataset, addAnnotationTimeline,
    updateAnnotationTimeline, deleteAnnotationTimeline, getAnnotationTimeline} from "../../store/query/actions";

const AnnotatedTimeline = ({ timeline, videoDuration, startTime,
                              onSelectAnnotation, currentTime }) => {
    return (
        <div style={{ margin: "20px 0" }}>
            {/* Colored horizontal line */}
            <div
                style={{
                    position: "relative",
                    height: "10px",
                    backgroundColor: timeline.color,
                    borderRadius: "5px",
                    margin: "10px 0",
                }}
            >
                {/* Annotation markers */}
                {timeline.annotations.map((annotation, index) => {
                    return (
                        <div
                            key={index}
                            style={{
                                position: "absolute",
                                top: "-5px",
                                left: `${((annotation.start_timestamp - startTime) / videoDuration) * 100}%`,
                                width: "12px",
                                height: "12px",
                                backgroundColor: "white",
                                border: `2px solid ${timeline.color}`,
                                borderRadius: "50%",
                                cursor: "pointer",
                            }}
                            onClick={() => onSelectAnnotation(annotation)}
                            title={`Timestamp: ${annotation.start_timestamp}`}
                        />
                    );
                })}
            </div>
        </div>
    );
};


const VideoStreamer = (props) => {
    const { onFetchExperiments, onFetchDataset, onAddAnnotationTimeline,
        onDeleteAnnotationTimeline, onFetchAnnotationTimelines,
        onUpdateAnnotationTimeline, timelines,
        rigs, datasetVideos } = props;
    const datasetVideosRef = useRef(null);
    const [selectedRig, setSelectedRig] = useState(null);
    const [selectedExperiment, setSelectedExperiment] = useState(null);
    const [selectedDataset, setSelectedDataset] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [newTimelineName, setNewTimelineName] = useState("");
    const [newTimelineOwner, setNewTimelineOwner] = useState("");
    const [newTimelineColor, setNewTimelineColor] = useState("#007bff");

    const [selectedTimelineId, setSelectedTimelineId] = useState(null);
    const [selectedAnnotation, setSelectedAnnotation] = useState(null);
    const [annotationMode, setAnnotationMode] = useState(false);
    const [annotationStart, setAnnotationStart] = useState(null);
    const [annotationEnd, setAnnotationEnd] = useState(null);
    const [annotationNote, setAnnotationNote] = useState("");
    const [zoomVisible, setZoomVisible] = useState(false);
    const [drawing, setDrawing] = useState(false);
    const [boundingBox, setBoundingBox] = useState(null)
    const [socket, setSocket] = useState(null);
    const [frameSrc, setFrameSrc] = useState("");
    const [open, setOpen] = useState(null);
    const [currentTimes, setCurrentTimes] = useState({});
    const [currentExperiment, setCurrentExperiment] = useState(null);
    const currentTimestampRef = useRef();
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
    const [currentVideo, setCurrentVideo] = useState("");
    const [fps, setFps] = useState(0);
    const [ws, setWs] = useState(null); // WebSocket instance
    const [streamId, setStreamId] = useState(''); // Stream ID returned from server
    const [streaming, setStreaming] = useState(false); // Flag to track streaming state
    const [seekFrame, setSeekFrame] = useState(0); // Frame number to start from
    const canvasRef = useRef();
    const currentExperimentRef = useRef(null);
    const annotationsMapRef = useRef(new Map()); // UseRef for concurrent access

    const findGapsInTimestamps = (experiment) => {
        if (!experiment || !experiment.videos || experiment.videos.length === 0) return [];

        // Sort videos by start_timestamp
        const sortedVideos = [...experiment.videos].sort(
            (a, b) => new Date(a.start_timestamp) - new Date(b.start_timestamp)
        );

        const gaps = [];
        for (let i = 0; i < sortedVideos.length - 1; i++) {
            const currentEnd = new Date(sortedVideos[i].end_timestamp).getTime();
            const nextStart = new Date(sortedVideos[i + 1].start_timestamp).getTime();

            if (currentEnd < nextStart) {
                // There's a gap between the current video's end and the next video's start
                gaps.push({ start: currentEnd, end: nextStart });
            }
        }

        return gaps;
    };

    useEffect(() => {

        onFetchExperiments();

        const socket = io("http://10.101.10.93:8765", {
            transports: ["websocket"],
            upgrade: false,
        });
        setSocket(socket);

        socket.on('connect', () => {
            console.log('Socket.io connection established, id:', socket.id); // Log the socket id (sid)
        });

        socket.on('stream_id', (data) => {
            console.log('Stream ID generated',data);
            setStreamId(data.sid)
        });

        socket.on("end_of_video",  () => {
            const videos = datasetVideosRef.current?.videos;
            if (!videos || videos.length === 0) {
                console.warn("No datasetVideos loaded yet.");
                return;
            }

            const nextVideo = videos.find(
                (v) => new Date(v.start_timestamp).getTime() > currentTimestampRef.current
            );

            if (nextVideo) {
                const nextStartTime = new Date(nextVideo.start_timestamp).getTime();
                console.log("⏭ Automatically jumping to next video at", nextStartTime);
                handleSliderChange(nextStartTime + 2); // Ensure it's in range
            } else {
                console.log("✅ All videos complete.");
            }
        });

        socket.on('preview_frame', (data) => {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            console.log('Received video frame');

            // Convert the binary data to base64
            const base64String = btoa(
                new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            const image = new Image();
            image.src = `data:image/jpeg;base64,${base64String}`;

            image.onload = () => {

                const originalWidth = 2320; // Original image width
                const originalHeight = 2048; // Original image height
                const displayedWidth = 1160; // Displayed image width
                const displayedHeight = 1024; // Displayed image height
                const scaleX = displayedWidth / originalWidth; // Scale factor for X
                const scaleY = displayedHeight / originalHeight; // Scale factor for Y

                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;

                // Optional: Disable image smoothing for sharp rendering
                context.imageSmoothingEnabled = false;

                // Clear and draw the frame
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
            }
        });

        socket.on("annotations", (data) => {
            const updatedMap = annotationsMapRef.current;
            updatedMap.clear();

            // Iterate through the incoming annotations
            Object.entries(data).forEach(([timestamp, animals]) => {
                const parsedTimestamp = new Date(timestamp).getTime(); // Parse the timestamp as a number for consistency

                // If the timestamp doesn't exist, add it
                if (!updatedMap.has(parsedTimestamp)) {
                    updatedMap.set(parsedTimestamp, new Map());
                }

                const animalMap = updatedMap.get(parsedTimestamp);

                // Merge the animal annotations for this timestamp
                Object.entries(animals).forEach(([animal, locations]) => {
                    if (!animalMap.has(animal)) {
                        animalMap.set(animal, []);
                    }

                    // Append new locations to existing ones
                    const existingLocations = animalMap.get(animal);
                    animalMap.set(animal, [...existingLocations, ...locations]);
                });
            });

            // Update the ref with the modified map
            annotationsMapRef.current = updatedMap;

            console.log("Updated Annotations Map:", annotationsMapRef.current);
        });

        socket.on('video_frame', (data) => {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            console.log('Received video frame');

            // Convert the binary data to base64
            const base64String = btoa(
                new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );

            // Update the image source with the new frame
            const image = new Image();
            image.src = `data:image/jpeg;base64,${base64String}`;

            image.onload = () => {

                const originalWidth = 2320; // Original image width
                const originalHeight = 2048; // Original image height
                const displayedWidth = 1245; // Displayed image width
                const displayedHeight = 768; // Displayed image height
                const scaleX = displayedWidth / originalWidth; // Scale factor for X
                const scaleY = displayedHeight / originalHeight; // Scale factor for Y

                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;

                // Optional: Disable image smoothing for sharp rendering
                context.imageSmoothingEnabled = false;

                // Clear and draw the frame
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0, canvas.width, canvas.height);

                const currentTime = currentTimestampRef.current;
                const annotationsMap = annotationsMapRef.current;
                const closestTimestamp = findClosestKey(currentTime, annotationsMap);

                if (closestTimestamp) {
                    const frameAnnotations = annotationsMap.get(closestTimestamp) || new Map(); // Ensure it's a Map

                    for (const [animal, annotations] of frameAnnotations.entries()) {
                        annotations.forEach((annotation) => {
                            const { center_x, center_y, width, height } = annotation;

                            // Scale the annotation coordinates and dimensions
                            const scaledX = center_x * scaleX;
                            const scaledY = center_y * scaleY;
                            const scaledWidth = width * scaleX;
                            const scaledHeight = height * scaleY;

                            // Draw the bounding box on the canvas
                            const x = scaledX - scaledWidth / 2; // Adjust for center_x
                            const y = scaledY - scaledHeight / 2; // Adjust for center_y

                            context.strokeStyle = "blue";
                            context.lineWidth = 2;
                            context.strokeRect(x, y, scaledWidth, scaledHeight);

                            // Draw animal label
                            context.fillStyle = "white";
                            context.font = "12px Arial";
                            context.fillText(animal, x, y - 5);
                        });
                    }
                }
            };

            currentTimestampRef.current += 50;
            setCurrentTimes(currentTimestampRef.current);

    });



    socket.on('disconnect', () => {
      console.log('Socket.io connection disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

    useEffect(() => {
        if (selectedRig && selectedExperiment && selectedDataset) {
            let query = {
                rig: selectedRig.rig,
                trial: selectedExperiment.trial,
                cohort: selectedExperiment.cohort,
                dataset: selectedDataset.name
            }
            onFetchDataset(query);
        }
    }, [selectedRig, selectedExperiment, selectedDataset, onFetchDataset]);

    useEffect(() => {
        if (datasetVideos == undefined) return
        datasetVideosRef.current = datasetVideos;
        const query = {
            dataset: selectedDataset.name,
            cohort: selectedExperiment.cohort,
            rig: selectedRig.rig,
            trial: selectedExperiment.trial
        };
        onFetchAnnotationTimelines(query)
    }, [datasetVideos]);

    const handleDeleteTimeline = (timeline) => {
        if (window.confirm(`Delete timeline "${timeline.name}"?`)) {
            onDeleteAnnotationTimeline(timeline.id); // saga/dispatch
            if (selectedTimelineId === timeline.id) {
                setSelectedTimelineId(null);
            }
        }
    };

    const handleSelectAnnotation = (annotation, timeline) => {
        setAnnotationStart(annotation.start_timestamp);
        setAnnotationEnd(annotation.end_timestamp);
        setAnnotationNote(annotation.note || "");
        setSelectedTimelineId(timeline._id || timeline.id); // Keep track of context

        // Jump to the timestamp
        handleSliderChange(annotation.start_timestamp);
    };
    
    const handleAddTimeline = () => {
        const newTimeline = {
            id: uuidv4(),
            name: newTimelineName || "Untitled",
            owner: newTimelineOwner || "Unknown",
            color: newTimelineColor || "#007bff",
            dataset: selectedDataset.name,
            cohort: selectedExperiment.cohort,
            rig: selectedRig.rig,
            trial: selectedExperiment.trial,
            annotations: [],
        };

        onAddAnnotationTimeline(newTimeline); // dispatch to saga/backend
        setSelectedTimelineId(newTimeline.id);

        // Reset modal + close
        setNewTimelineName("");
        setNewTimelineOwner("");
        setNewTimelineColor("#007bff");
        setShowModal(false);
    };


    const getRandomColor = () => {
        const colors = ["blue", "red", "green", "purple", "orange"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const findClosestKey = (targetTime, annotationsMap) => {
        const timestamps = Array.from(annotationsMap.keys());

        if (timestamps.length === 0) return null;

        // Sort timestamps (if not already sorted)
        timestamps.sort((a, b) => a - b);

        // Binary search for closest key
        let left = 0;
        let right = timestamps.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);

            if (timestamps[mid] === targetTime) {
                return timestamps[mid];
            } else if (timestamps[mid] < targetTime) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        // Determine the closest key between `left` and `right`
        const leftDiff = left < timestamps.length
            ? Math.abs(timestamps[left] - targetTime)
            : Infinity;
        const rightDiff = right >= 0
            ? Math.abs(timestamps[right] - targetTime)
            : Infinity;

        return leftDiff < rightDiff ? timestamps[left] : timestamps[right];
    };

    const handleJump = (videoFile, frameIndex) => {
        if (socket && socket.connected) {
            const startTime = new Date(parseInt(currentTimestampRef.current))
            const adjustedTimestamp = new Date(startTime.getTime() - 4 * 60 * 60 * 1000);

            // Send the "start" command to the server with user-defined inputs
            socket.emit('jump', {
                video_file: videoFile,
                frame_number: frameIndex, // Ensure seekFrame is a number
            });
            setStreaming(true);
        }
    };

    const handleStartStreaming = () => {
        if (socket && socket.connected) {
            const startTime = new Date(parseInt(currentTimestampRef.current))
            const adjustedTimestamp = new Date(startTime.getTime() - 4 * 60 * 60 * 1000);

            socket.emit("get_annotations", {
                time: adjustedTimestamp.toISOString(),
            });

            // Send the "start" command to the server with user-defined inputs
            socket.emit('start', {
                command: 'start',
                frame_number: currentFrameIndex, // Ensure seekFrame is a number
                video_file: currentVideo, // User-defined video file path
            });
            setStreaming(true);
        }
    };

    // Function to send "stop" command to the server using socket.io
    const handleStopStreaming = () => {
        if (socket && socket.connected) {
            // Send the "stop" command using the assigned stream ID
            socket.emit('stop', {
                command: 'stop',
                stream_id: streamId
            });
            setStreaming(false);
        }
    };

    const handleSliderChange = (value) => {
        const rawTimestamp = parseInt(value, 10); // use exact timestamp from slider
        const timestampForVideo = rawTimestamp - 4 * 60 * 60 * 1000; // apply offset only for video lookup

        currentTimestampRef.current = rawTimestamp; // keep slider aligned with what user clicked

        const videos = datasetVideosRef.current?.videos;
        const currentVideoIndex = videos.findIndex(video => {
            const videoStart = new Date(video.start_timestamp).getTime();
            const videoEnd = new Date(video.end_timestamp).getTime();
            return timestampForVideo >= videoStart && timestampForVideo <= videoEnd;
        });

        if (currentVideoIndex !== -1) {
            const currentVideo = videos[currentVideoIndex];
            const videoStart = new Date(currentVideo.start_timestamp).getTime();
            const elapsedTime = (timestampForVideo - videoStart) / 1000;
            const frameIndex = Math.floor(elapsedTime * (videos.fps || 30));

            setCurrentFrameIndex(frameIndex);
            setCurrentVideo(currentVideo.location);
            handleJump(currentVideo.location, frameIndex);
        } else {
            const nextVideo = videos.find(
                (video) => new Date(video.start_timestamp).getTime() > timestampForVideo
            );
            if (nextVideo) {
                setTimeout(() => {
                    handleSliderChange(new Date(nextVideo.start_timestamp).getTime()+2);
                }, 1000);
            } else {
                console.log("No more videos.");
            }
        }
    };

    const handleSaveAnnotation = () => {
        if (!selectedTimelineId) {
            console.warn("No timeline selected");
            return;
        }

        const newAnnotation = {
            start_timestamp: annotationStart,
            end_timestamp: annotationEnd,
            note: annotationNote,
        };

        const updatedTimelines = timelines.map((timeline) => {
            if (timeline.id === selectedTimelineId) {
                const updated = {
                    ...timeline,
                    annotations: [...timeline.annotations, newAnnotation],
                };
                // Persist to backend
                onUpdateAnnotationTimeline(updated);
                return updated;
            }
            return timeline;
        });

        setAnnotationMode(false);
        setAnnotationStart(null);
        setAnnotationEnd(null);
        setAnnotationNote("");
    };

    const handleAnnotationSelect = (annotation) => {
        currentTimestampRef.current = annotation.start_timestamp;
        setAnnotationStart(annotation.start_timestamp);
        setAnnotationEnd(annotation.end_timestamp);
        setAnnotationNote(annotation.note);
        setAnnotationMode(true);

        const videoTime = annotation.start_timestamp - 4 * 60 * 60 * 1000;
        const currentVideo = findCurrentVideo(videoTime); // your function
        if (currentVideo) {
            const videoStart = new Date(currentVideo.start_timestamp).getTime();
            const frameIndex = Math.floor((videoTime - videoStart) / 1000 * (datasetVideos.fps || 30));
            setCurrentVideo(currentVideo.location);
            setCurrentFrameIndex(frameIndex);
            handleJump(currentVideo.location, frameIndex);
        }
    };

    const handleMouseDown = (event) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        setDrawing(true);
        setBoundingBox({ x, y, width: 0, height: 0 });
    };

    const handleMouseMove = (event) => {
        if (!drawing || !boundingBox) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const width = event.clientX - rect.left - boundingBox.x;
        const height = event.clientY - rect.top - boundingBox.y;

        setBoundingBox((prev) => ({ ...prev, width, height }));
    };

    const handleMouseUp = () => {
        setDrawing(false);
    };


    let startTime = Date.now();
    let endTime = Date.now();
    let zoomMin = 0;
    let zoomMax = 0;
    let railBackground = "green";

    if (selectedDataset && datasetVideos && datasetVideos.videos && datasetVideos.videos .length > 0) {
        const sortedVideos = [...datasetVideos.videos].sort(
            (a, b) => new Date(a.start_timestamp) - new Date(b.start_timestamp)
        );

        startTime = new Date(sortedVideos[0].start_timestamp).getTime();
        endTime = new Date(sortedVideos[sortedVideos.length - 1].end_timestamp).getTime();

        const zoomWindowSize = 5 * 60 * 1000;
        zoomMin = Math.max(currentTimestampRef.current - zoomWindowSize, startTime);
        zoomMax = Math.min(currentTimestampRef.current + zoomWindowSize, endTime);

        const gaps = findGapsInTimestamps({ videos: sortedVideos });

        const gradientStops = ["green 0%"];
        gaps.forEach((gap) => {
            const gapStart = ((new Date(gap.start) - startTime) / (endTime - startTime)) * 100;
            const gapEnd = ((new Date(gap.end) - startTime) / (endTime - startTime)) * 100;
            gradientStops.push(`green ${gapStart}%`);
            gradientStops.push(`red ${gapStart}%`);
            gradientStops.push(`red ${gapEnd}%`);
            gradientStops.push(`green ${gapEnd}%`);
        });
        gradientStops.push("green 100%");
        railBackground = `linear-gradient(to right, ${gradientStops.join(", ")})`;
    }

    return (
        <div className="page-content">
            <Container fluid>
                {/* RIGS */}
                {!selectedRig && (
                    <Row>
                        {rigs.map((rig, i) => (
                            <Col md={6} lg={4} key={i} className="mb-3">
                                <Card>
                                    <CardHeader>
                                        <strong>{rig.rig}</strong>
                                    </CardHeader>
                                    <CardBody>
                                        <p><strong>Description:</strong> {rig.description}</p>
                                        <p><strong>Modalities:</strong> {rig.data_modalities.join(", ")}</p>
                                        <p><strong>Experimenters:</strong> {rig.experimenters.join(", ")}</p>
                                        {rig.animals.length > 0 && (
                                            <p><strong>Animals:</strong> {rig.animals.join(", ")}</p>
                                        )}
                                        <Button color="primary" onClick={() => setSelectedRig(rig)}>
                                            Select Rig
                                        </Button>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}

                {/* EXPERIMENTS */}
                {selectedRig && !selectedExperiment && (
                    <>
                        <Card className="mb-4">
                            <CardHeader>
                                <h4>{selectedRig.rig}</h4>
                            </CardHeader>
                            <CardBody>
                                <p><strong>Description:</strong> {selectedRig.description}</p>
                                <p><strong>Modalities:</strong> {selectedRig.data_modalities.join(", ")}</p>
                                <Button color="secondary" onClick={() => setSelectedRig(null)}>
                                    ← Back to Rigs
                                </Button>

                            {selectedRig.experiments.map((exp, i) => (
                                <Row>
                                <Col md={12} key={i} style={{marginTop: "10px", marginBottom: "10px"}}>
                                    <Card>
                                        <CardHeader>
                                            <b>Trial {exp.trial}, Cohort {exp.cohort}</b><br/>
                                            <strong>Description:</strong> {exp.description || "—"}<br/>
                                            <strong>Start:</strong> {new Date(exp.start_date).toLocaleString()}<br/>
                                        <strong>End:</strong> {new Date(exp.end_date).toLocaleString()}<br/>
                                            <Button color="primary" onClick={() => setSelectedExperiment(exp)}>
                                                Select Experiment
                                            </Button>
                                        </CardHeader>
                                    </Card>
                                </Col>
                                </Row>
                            ))}
                            </CardBody>
                        </Card>
                    </>
                )}

                {/* DATASETS */}
                {selectedExperiment && !selectedDataset && (
                    <>
                        <Card className="mb-12">
                            <CardHeader>
                                <h4>{selectedRig.rig}</h4>
                                <h4> Cohort {selectedExperiment.cohort}, Trial {selectedExperiment.trial}</h4>
                            </CardHeader>
                            <CardBody>
                                <p><strong>Description:</strong> {selectedExperiment.description || "—"}</p>
                                <p><strong>Start:</strong> {new Date(selectedExperiment.start_date).toLocaleString()}</p>
                                <p><strong>End:</strong> {new Date(selectedExperiment.end_date).toLocaleString()}</p>
                                <Button color="secondary" onClick={() => setSelectedExperiment(null)}>
                                    ← Back to Experiments
                                </Button>
                            </CardBody>
                        </Card>

                        <Row>
                            <Col md={12}>
                                <Card className="ps-4">
                                    <CardHeader>
                                        <h5>Datasets</h5>
                                    </CardHeader>
                                    <CardBody>
                                        {selectedExperiment.datasets.map((ds, i) => (
                                            <Row key={i} className="align-items-center mb-2">
                                                <Col md={6}><strong>{ds.name}</strong> ({ds.sensor})</Col>
                                                <Col md="auto">
                                                    <Button color="primary" onClick={() => setSelectedDataset(ds)}>
                                                        Select Dataset
                                                    </Button>
                                                </Col>
                                            </Row>
                                        ))}
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                    </>
                )}

                {/* DATASET SELECTED */}
                {selectedDataset && (
                    <Card className="mb-4">
                        <CardHeader>
                            <h4>{selectedDataset.name}</h4>
                        </CardHeader>
                        <CardBody>
                            <p><strong>Sensor:</strong> {selectedDataset.sensor}</p>
                            <Button color="secondary" onClick={() => setSelectedDataset(null)}>
                                ← Back to Datasets
                            </Button>

                            {/* Video Frame */}
                                <div className="d-flex gap-4">
                                    {/* Canvas */}
                                    <div style={{flex: 3}}>
                                        <canvas
                                            ref={(el) => {
                                                if (el) {
                                                    canvasRef.current = el;
                                                } else {
                                                    canvasRef.current = undefined;
                                                }
                                            }}
                                            width={700}
                                            height={480}
                                            onMouseDown={handleMouseDown}
                                            onMouseMove={handleMouseMove}
                                            onMouseUp={handleMouseUp}
                                            style={{
                                                border: "1px solid #ccc",
                                                width: "75%",
                                                maxWidth: "75%",
                                            }}
                                        />
                                    </div>

                                    {/* Annotation Controls */}
                                    <div style={{flex: 1}}>
                                        <Button color="primary" onClick={() => {
                                            setAnnotationMode(true);
                                            setAnnotationStart(null);
                                            setAnnotationEnd(null);
                                            setAnnotationNote("");
                                        }}>
                                            Add Annotation
                                        </Button>

                                        <div className="mt-3">
                                            <Button
                                                color="primary"
                                                className="mb-2"
                                                onClick={() => setAnnotationStart(currentTimestampRef.current)}
                                                disabled={!annotationMode || annotationStart !== null}
                                            >
                                                Set Start
                                            </Button>

                                            <Button
                                                color="primary"
                                                className="mb-2"
                                                onClick={() => setAnnotationEnd(currentTimestampRef.current)}
                                                disabled={!annotationMode || annotationEnd !== null || annotationStart === null}
                                            >
                                                Set End
                                            </Button>

                                            <textarea
                                                className="form-control mb-2"
                                                rows={4}
                                                placeholder="Enter annotation note..."
                                                value={annotationNote}
                                                onChange={(e) => setAnnotationNote(e.target.value)}
                                                disabled={!annotationMode}
                                            />

                                            <Button
                                                color="success"
                                                onClick={handleSaveAnnotation}
                                                disabled={
                                                    !annotationMode || !annotationStart || !annotationEnd || !annotationNote.trim()
                                                }
                                            >
                                                Save Annotation
                                            </Button>
                                        </div>
                                    </div>

                            </div>

                            {/* Timeline Slider */}
                            <div className="d-flex flex-column align-items-center mb-3">
                                <div className="d-flex justify-content-between w-100 mb-2">
                                    <div>
                                        <strong>Start:</strong>{" "}
                                        {new Date(startTime).toLocaleString()}
                                    </div>
                                    <div>
                                        <strong>End:</strong>{" "}
                                        {new Date(endTime).toLocaleString()}
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min={startTime}
                                    max={endTime}
                                    value={currentTimestampRef.current}
                                    className="form-range"
                                    style={{width: "100%"}}
                                    onChange={(e) =>
                                        handleSliderChange(parseInt(e.target.value))
                                    }
                                />

                            </div>

                            {/* Time & Annotation Controls */}
                            <div className="text-center mb-3">
                                <strong>Current Time:</strong>{" "}
                                {new Date(parseInt(currentTimestampRef.current)).toLocaleString()}
                            </div>

                            {/* Start/Stop */}
                            <div className="d-flex justify-content-center gap-3 mb-3">
                                <Button color="success" onClick={handleStartStreaming}>Play</Button>
                                <Button color="danger" onClick={handleStopStreaming}>Stop</Button>
                            </div>

                            {/* Timelines */}
                            <div>
                                <Button color="primary" onClick={() => setShowModal(true)}>
                                    Add New Timeline
                                </Button>

                                <div className="annotation-timelines">
                                    {timelines.map((timeline) => (
                                        <div
                                            key={timeline.id}
                                            className={`border rounded p-3 mb-3 timeline-box ${timeline.id === selectedTimelineId ? "border-primary bg-light" : "cursor-pointer"}`}
                                            onClick={() => setSelectedTimelineId(timeline.id)}
                                            style={{ transition: "0.2s", cursor: "pointer" }}
                                        >
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <h5 className="mb-1">{timeline.name}</h5>
                                                    <div className="text-muted small">
                                                        <div>Owner: {timeline.owner}</div>
                                                        <div>Created: {new Date(timeline.createdDate).toLocaleDateString()}</div>
                                                    </div>
                                                </div>

                                                <Button
                                                    size="sm"
                                                    color="danger"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent selection when deleting
                                                        handleDeleteTimeline(timeline);
                                                    }}
                                                    title="Delete timeline"
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </Button>
                                            </div>

                                            <AnnotatedTimeline
                                                timeline={timeline}
                                                onSelectAnnotation={handleAnnotationSelect}
                                                videoDuration={endTime - startTime}
                                                startTime={startTime}
                                                currentTime={currentTimestampRef.current}
                                                onSelectAnnotation={(annotation) => handleSelectAnnotation(annotation, timeline)}
                                            />
                                        </div>
                                    ))}

                                </div>
                            </div>
                        </CardBody>
                    </Card>
                )}

            </Container>

            <Modal isOpen={showModal} toggle={() => setShowModal(false)}>
                <ModalHeader toggle={() => setShowModal(false)}>Create New Timeline</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="timelineName">Name</Label>
                            <Input
                                id="timelineName"
                                value={newTimelineName}
                                onChange={(e) => setNewTimelineName(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="timelineOwner">Owner</Label>
                            <Input
                                id="timelineOwner"
                                value={newTimelineOwner}
                                onChange={(e) => setNewTimelineOwner(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="timelineColor">Color</Label>
                            <Input
                                type="color"
                                id="timelineColor"
                                value={newTimelineColor}
                                onChange={(e) => setNewTimelineColor(e.target.value)}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleAddTimeline}>
                        Save
                    </Button>{" "}
                    <Button color="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>

        </div>


    );


};
const mapStateToProps = ({ dataquery }) => {
return ({
    rigs: dataquery.experiments,
    datasetVideos: dataquery.datasetVideos[0],
    timelines: dataquery.timelines
})
}


const mapDispatchToProps = (dispatch) => ({
    onFetchExperiments: () => dispatch(getExperiments()),
    onFetchDataset: (query) => dispatch(getDataset(query)),
    onFetchAnnotationTimelines: (query) => dispatch(getAnnotationTimeline(query)),
    onAddAnnotationTimeline: (timeline) => dispatch(addAnnotationTimeline(timeline)),
    onDeleteAnnotationTimeline: (timeline) => dispatch(deleteAnnotationTimeline(timeline)),
    onUpdateAnnotationTimeline: (timeline) => dispatch(updateAnnotationTimeline(timeline)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoStreamer);
