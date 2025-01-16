import React, { useEffect, useState, useRef } from "react";
import {
    Collapse,
    Row,
    Col,
    Button,
    Card,
    CardHeader,
    CardBody,
    Container,
} from "reactstrap";
import { connect } from "react-redux";
import { io } from "socket.io-client";
import { getExperiments } from "../../store/query/actions";

const AnnotatedTimeline = ({ timeline, videoDuration, startTime, currentTime }) => {
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
                                left: `${((annotation.timestamp - startTime) / videoDuration) * 100}%`,
                                width: "12px",
                                height: "12px",
                                backgroundColor: "white",
                                border: `2px solid ${timeline.color}`,
                                borderRadius: "50%",
                                cursor: "pointer",
                            }}
                            title={`Timestamp: ${annotation.timestamp}`}
                        />
                    );
                })}
            </div>
        </div>
    );
};


const VideoStreamer = (props) => {
    const { onFetchExperiments, experiments } = props;
    const [socket, setSocket] = useState(null);
    const [frameSrc, setFrameSrc] = useState("");
    const [open, setOpen] = useState(null);
    const [currentTimes, setCurrentTimes] = useState({});
    const [currentExperiment, setCurrentExperiment] = useState({});
    const currentTimestampRef = useRef();
    const [timelines, setTimelines] = useState([
        {
            id: 1,
            color: "blue",
            annotations: [
                { timestamp: 1721840323000 }, // 07/24/2024, 09:38:43 AM
                { timestamp: 1721840523000 }, // 07/24/2024, 09:42:03 AM
            ],
        }
    ]);
    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
    const [currentVideo, setCurrentVideo] = useState("");
    const [fps, setFps] = useState(0);
    const [ws, setWs] = useState(null); // WebSocket instance
    const [streamId, setStreamId] = useState(''); // Stream ID returned from server
    const [streaming, setStreaming] = useState(false); // Flag to track streaming state
    const [seekFrame, setSeekFrame] = useState(0); // Frame number to start from
    const canvasRef = useRef(new Map());
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

        const socket = io("http://10.101.10.85:8765", {
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

    const addTimeline = () => {
        const newTimeline = {
            id: timelines.length + 1,
            color: getRandomColor(),
            annotations: []
        };
        setTimelines([...timelines, newTimeline]);
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

    const toggle = (id) => setOpen(open === id ? null : id);

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

    const handleSliderChange = (value, experimentId) => {

            const timestamp = parseInt(value, 10)- 4 * 60 * 60 * 1000;

        // Find the current experiment
        const experiment = experiments.find(exp => exp._id === experimentId);
        currentTimestampRef.current = timestamp
        setFps(experiment.fps)

        var gaps = findGapsInTimestamps(experiment)
        console.log(gaps)

        // Find the video covering the timestamp
        const currentVideo = experiment.videos.find(video => {
            const videoStart = new Date(video.start_timestamp).getTime();
            const videoEnd = new Date(video.end_timestamp).getTime();
            return timestamp >= videoStart && timestamp <= videoEnd;
        });

        if (currentVideo) {
            // Calculate the frame index
            const videoStart = new Date(currentVideo.start_timestamp).getTime();
            const elapsedTime = (timestamp - videoStart) / 1000; // Elapsed time in seconds
            const frameIndex = Math.floor(elapsedTime * (experiment.fps || 30)); // Default to 30 fps
            setCurrentFrameIndex(frameIndex)
            setCurrentVideo(currentVideo.location)
            console.log(`Video: ${currentVideo.location}`);
            console.log(`Frame Index: ${frameIndex}`);

            handleJump(currentVideo.location, frameIndex)
        } else {
            console.log("No video found for the current timestamp.");
        }
    };

    return (
        <div className="page-content">
            <Container fluid>
                <Row>
                    {experiments.map((experiment, index) => {
                        const isOpen = open === index;

                        const startTime = new Date(experiment.start_timestamp).getTime();
                        const endTime = new Date(experiment.end_timestamp).getTime();

                        return (
                            <Card key={experiment._id} className="mb-3">
                                {/* Full-Width Header */}
                                <CardHeader
                                    onClick={() => toggle(index)}
                                    className="d-flex justify-content-between align-items-center bg-light"
                                    style={{ width: "100%" }}
                                >
                                  <div>
                                      <Row>
                                            <Col md={8}>
                                                <strong>Experiment:</strong> {experiment.experiment}
                                            </Col>
                                     </Row>
                                    <Row>
                                         <Col md={8}>
                                             <strong>Description:</strong> {experiment.description}
                                         </Col>
                                    </Row>
                                    <Row>
                                            <Col md={4}>
                                                <strong>Trial:</strong> {experiment.trial}
                                            </Col>
                                    </Row>
                                    <Row>
                                            <Col md={4}>
                                                <strong>FPS:</strong> {experiment.fps}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <strong>Start:</strong>{" "}
                                                {new Date(
                                                    experiment.start_timestamp
                                                ).toLocaleString()}
                                            </Col>
                                            <Col md={6}>
                                                <strong>End:</strong>{" "}
                                                {new Date(experiment.end_timestamp).toLocaleString()}
                                            </Col>
                                        </Row>
                                  </div>
                                    <div>{isOpen ? "▼" : "▶"}</div>
                                </CardHeader>

                                {/* Expandable Section */}
                                <Collapse isOpen={isOpen}>
                                    <CardBody className="p-3">
                                        {/* Video Frame */}
                                        <div>
                                                <canvas
                                                    ref={canvasRef}
                                                    style={{
                                                        width: "100%",
                                                        border: "1px solid #ccc",
                                                        marginBottom: "20px",
                                                    }}
                                                />

                                        </div>

                                        {/* Timeline Slider */}
                                        <div className="d-flex flex-column align-items-center mb-3">
                                            {/* Slider Labels: Start and End */}
                                            <div className="d-flex justify-content-between w-100 mb-2">
                                                <div>
                                                    <strong>Start:</strong>{" "}
                                                    {new Date(startTime).toLocaleString(undefined, {
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        second: "2-digit",
                                                    })}
                                                </div>
                                                <div>
                                                    <strong>End:</strong>{" "}
                                                    {new Date(endTime).toLocaleString(undefined, {
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        second: "2-digit",
                                                    })}
                                                </div>
                                            </div>
                                            <input
                                                type="range"
                                                min={startTime}
                                                max={endTime}
                                                value={currentTimestampRef.current}
                                                className="form-range"
                                                style={{ width: "100%" }}
                                                onChange={(e) =>
                                                    handleSliderChange(e.target.value, experiment._id)
                                                }
                                            />
                                        </div>

                                        {/* Current Time Display */}
                                        <div className="text-center mb-3">
                                            <strong>Current Time:</strong>{" "}
                                            {new Date(parseInt(currentTimestampRef.current)).toLocaleString(
                                                undefined,
                                                {
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                }
                                            )}
                                        </div>

                                        {/* Start/Stop Buttons */}
                                        <div className="d-flex justify-content-center gap-3">
                                            <Button color="success"  onClick={() =>
                                                handleStartStreaming()
                                            }>Start</Button>
                                            <Button color="danger"  onClick={() =>
                                                handleStopStreaming()
                                            }>Stop</Button>
                                        </div>
                                        <div>
                                            <button onClick={addTimeline}>Add New Timeline</button>
                                            <div className="annotation-timelines">
                                                {timelines.map((timeline) => (
                                                    <AnnotatedTimeline
                                                        key={timeline.id}
                                                        timeline={timeline}
                                                        videoDuration={endTime - startTime}
                                                        startTime={startTime}
                                                        currentTime={currentTimestampRef.current}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </CardBody>
                                </Collapse>
                            </Card>
                        );
                    })}
                </Row>
            </Container>
        </div>
    );
};
const mapStateToProps = ({ dataquery }) => ({
    experiments: dataquery.experiments.map((experiment) => ({
        ...experiment,
        videos: experiment.videos
            ? experiment.videos.sort(
                (a, b) =>
                    new Date(a.start_timestamp).getTime() -
                    new Date(b.start_timestamp).getTime()
            )
            : [],
    })),
});


const mapDispatchToProps = (dispatch) => ({
    onFetchExperiments: () => dispatch(getExperiments()),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoStreamer);
