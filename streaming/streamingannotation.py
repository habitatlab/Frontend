from datetime import datetime
import numpy as np
import cv2
import socketio
import time
from pymongo import MongoClient
import subprocess
import logging
import uuid
import threading
import asyncio
import signal
from collections import defaultdict
from uvicorn import Config, Server


# Set up basic logging configuration
logging.basicConfig(
    level=logging.INFO,  # Set logging level to DEBUG to capture all messages
    format='%(asctime)s - %(levelname)s - %(message)s',  # Specify log message format
)
logger = logging.getLogger("VideoStreamerLogger")

# Create a new asynchronous Socket.IO server instance
sio = socketio.AsyncServer(cors_allowed_origins='*', async_mode='asgi')
app = socketio.ASGIApp(sio)

# Global dictionary to store active video streams
active_streamers = {}
streamer_lock = threading.Lock()

# Timeout duration in seconds (e.g., 60 seconds of inactivity)
STREAM_TIMEOUT = 60
shutdown_event = threading.Event()  # Event to signal shutdown to threads

# MongoDB connection
dbUri = ""
dbUser = ""
dbPassword = ""
dbAuthSource = "admin"

client = MongoClient(
    dbUri,
    username=dbUser,
    password=dbPassword,
    authSource=dbAuthSource
)
db = client.ratburrow
animal_location = db.animal_location

def parse_iso_datetime(iso_str):
    """
    Parses an ISO 8601 string, handling the 'Z' (UTC designator) correctly.
    """
    try:
        # Replace 'Z' with '+00:00' to make it ISO 8601 compliant for Python
        if iso_str.endswith('Z'):
            iso_str = iso_str.replace('Z', '+00:00')

        # Parse the ISO string
        return datetime.fromisoformat(iso_str)
    except ValueError as e:
        print(f"Error parsing datetime: {e}")
        return None

class VideoStreamer:
    def __init__(self, video_path, sid):
        self.video_path = video_path
        self.sid = sid
        self.current_frame = 0
        self.streaming_active = True
        self.last_interaction_time = time.time()  # Track last interaction time
        self.logger = logging.getLogger("VideoStreamerLogger")  # Use named logger
        self.stream_process = None

    def reset_timeout(self):
        """Resets the last interaction time to the current time."""
        self.last_interaction_time = time.time()

    def seek_to_frame(self, frame_number):
        """
        Start FFmpeg to seek to a specific frame and output raw video to stdout.
        """
        fps = 20  # Assuming a fixed FPS
        time_in_seconds = frame_number / fps

        ffmpeg_command = [
            'ffmpeg', '-hwaccel', 'cuda', '-c:v', 'hevc_cuvid',
            '-ss', str(time_in_seconds),  # Seek to timestamp
            '-i', self.video_path,  # Input video file
            '-frames:v', '1',  # Output exactly 1 frame
            '-f', 'rawvideo',  # Output raw video
            '-pix_fmt', 'yuv444p',
            '-'  # Output to stdout
        ]

        logging.info(f"Running FFmpeg command: {' '.join(ffmpeg_command)}")
        self.stream_process = subprocess.Popen(ffmpeg_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    def seek_to_stream(self, frame_number):
        fps = 20  # Assuming a fixed FPS of 20. Adjust if needed.
        time_in_seconds = frame_number / fps

        ffmpeg_command = [
            'ffmpeg', '-hwaccel', 'cuda', '-c:v', 'hevc_cuvid',
            '-ss', str(time_in_seconds),  # Seek to the target timestamp
            '-i', self.video_path,  # Input video file path
            '-vsync', 'vfr',  # Variable frame rate (important for consistency)
            '-f', 'rawvideo', '-pix_fmt', 'yuv444p', '-'  # Output raw video
        ]
        command_str = ' '.join(ffmpeg_command)
        logging.info(f"FFmpeg command: {command_str}")

        self.stream_process = subprocess.Popen(ffmpeg_command, stdout=subprocess.PIPE)

        logging.info(f"Successfully sought to frame {frame_number} (approximately at {time_in_seconds} seconds).")

    def read_frame(self, width=2320, height=2048):
        frame_size = width * height * 3  # 3 bytes per pixel (BGR)
        raw_frame = self.stream_process.stdout.read(frame_size)
        if not raw_frame:
           return None  # End of stream or error

        y_plane = np.frombuffer(raw_frame[0:width * height], np.uint8).reshape((height, width))
        u_plane = np.frombuffer(raw_frame[width * height:2 * width * height], np.uint8).reshape((height, width))
        v_plane = np.frombuffer(raw_frame[2 * width * height:], np.uint8).reshape((height, width))

        yuv_image = np.dstack((y_plane, u_plane, v_plane))
        rgb_image = cv2.cvtColor(yuv_image, cv2.COLOR_YUV2BGR)
        return rgb_image

    def release(self):
        """Release resources."""
        if self.stream_process:
            self.stream_process.terminate()
            self.stream_process.stdout.close()

    def stop(self):
        """Stops the streaming and sets the active flag to False."""
        self.streaming_active = False
        logging.info(f"[{self.sid}] Stream stopped.")

    async def start_streaming(self, sid, start_frame):
        global active_streamers

        try:
            # Open the video stream and seek to the start_frame
            self.seek_to_stream(start_frame)
            self.reset_timeout()  # Reset timeout on start
            logging.info(f"Started streaming for {sid} at frame {start_frame}")

            while self.streaming_active:
                # Check for timeout
                # Read the next frame
                frame = self.read_frame()
                if frame is None:
                    logging.info(f"[{sid}] End of video reached. Stopping stream.")
                    break

                # Resize the frame and encode as JPEG
                resized_frame = cv2.resize(frame, (1160, 768), interpolation=cv2.INTER_LINEAR)
                _, jpeg = cv2.imencode('.jpg', resized_frame)

                # Emit the frame over Socket.IO
                await sio.emit('video_frame', jpeg.tobytes(), to=sid)

                # Sleep to simulate frame rate control (e.g., 20 fps)
                await asyncio.sleep(0.02)  # 50 ms delay to achieve 20 frames per second

        finally:
            self.release()
            logging.info(f"[{sid}] Streamer stopped and resources released.")

            # Remove the streamer if the stream ends
            with streamer_lock:
                if sid in active_streamers:
                    del active_streamers[sid]
                    logging.info(f"[{sid}] Streamer removed from active streamers.")

    def fetch_single_frame(self, frame_number):
        """
        Fetch a single JPEG frame from the video and return it as binary data.
        """
        self.seek_to_frame(frame_number)  # Seek to the desired frame
        frame = self.read_frame()

        if frame is None:
            logging.error("Failed to read frame from FFmpeg output.")
            return None

        # Resize the frame (optional) and encode as JPEG
        resized_frame = cv2.resize(frame, (1245, 768), interpolation=cv2.INTER_LINEAR)
        success, jpeg = cv2.imencode('.jpg', resized_frame)
        if success:
            logging.info(f"Frame {frame_number} successfully encoded as JPEG.")
            return jpeg.tobytes()
        else:
            logging.error("Failed to encode frame as JPEG.")
            return None

# Socket.IO Event Handlers
@sio.event
async def connect(sid, environ):
    logger.info(f"Client connected: {sid}")


@sio.event
async def disconnect(sid):
    logger.info(f"Client disconnected: {sid}")
    with streamer_lock:
        if sid in active_streamers:
            active_streamers[sid].stop()
            del active_streamers[sid]

@sio.on('get_annotations')
async def fetch_annotations(sid, data):
    try:

        timestamp = parse_iso_datetime(data.get("time"))  # Expecting ISO 8601 format
        print (timestamp)
        # Query the MongoDB collection
        start_timer = time.time()  # Start the timer
        annotations = list(
            animal_location.find(
                {"start_timestamp": {"$lte": timestamp}, "end_timestamp":  {"$gte": timestamp}}
            )
        )
        end_timer = time.time()  # End the timer

        # Calculate duration
        duration = end_timer - start_timer
        print(f"Query took {duration:.4f} seconds.")

        print (len(annotations))
        aggregated_annotations = defaultdict(lambda: defaultdict(list))

        for doc in annotations:
            animal = doc["animal"]
            for location in doc["locations"]:
                timestamp = location["timestamp"].isoformat()  # Convert to ISO string

                # Add the location details for the current animal and timestamp
                aggregated_annotations[timestamp][animal].append({
                    "center_x": location["center_x"],
                    "center_y": location["center_y"],
                    "width": location["width"],
                    "height": location["height"],
                    "confidence": location["confidence"],
                })

        # Convert defaultdict to a regular dict before sending
        aggregated_annotations = {k: dict(v) for k, v in aggregated_annotations.items()}

        # Emit the aggregated annotations
        await sio.emit("annotations", aggregated_annotations, to=sid)
    except Exception as e:
        print ("ERROR", str(e))

@sio.on('start')
async def handle_start(sid, data):
    video_file = data.get("video_file", "")
    frame_number = data.get("frame_number", 0)

    if video_file == "":
        logging.info("No video file provided")
        return

    with streamer_lock:
        if sid not in active_streamers:
            logging.info(f"Creating new stream for ID: {sid}")
            active_streamers[sid] = VideoStreamer(video_file, sid)

        # Start streaming for this client
        streamer = active_streamers[sid]
        asyncio.create_task(streamer.start_streaming(sid, frame_number))

    # Send the stream_id back to the client
    await sio.emit('stream_id', {"sid": sid}, to=sid)


@sio.on('stop')
async def handle_stop(sid, data):
    with streamer_lock:
        if sid in active_streamers:
            logging.info(f"Stopping stream for ID: {sid}")
            active_streamers[sid].stop()
            del active_streamers[sid]

@sio.on('jump')
async def handle_jump(sid, data):
    video_file = data.get("video_file", "")
    frame_number = data.get("frame_number", 0)
    print (data)
    print ("SDFGSDG")
    with streamer_lock:
        if sid in active_streamers:
            logging.info(f"Stopping stream for ID: {sid}")
            active_streamers[sid].stop()
        else:
            active_streamers[sid] = VideoStreamer(video_file, sid)
        image_prev = active_streamers[sid].fetch_single_frame(frame_number)
        await sio.emit("preview_frame", image_prev, to=sid)


# Graceful shutdown handling
def shutdown_handler(signal_received, frame):
    logging.info("SIGINT received. Shutting down gracefully...")
    shutdown_event.set()  # Signal threads to stop


# Register the signal handler for Ctrl-C
signal.signal(signal.SIGINT, shutdown_handler)


# Start the Socket.IO server using Uvicorn (ASGI)
if __name__ == '__main__':
    config = Config(app, host="0.0.0.0", port=8765, log_level="info")
    server = Server(config)
    server.run()



