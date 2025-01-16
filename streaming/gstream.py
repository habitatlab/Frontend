import gi
gi.require_version('Gst', '1.0')
from gi.repository import Gst, GLib

# Initialize GStreamer
Gst.init(None)

# Create the pipeline
pipeline = Gst.parse_launch(
    'filesrc location=/nearline/karpova/Tervolab/data/Videos/MouseCityVideos/cohort1_3day/EMERGENT_2002627_20240722_1346_1.mp4 ! '
    'h265parse ! nvh265dec ! videoconvert ! autovideosink'
)

# Seek function
def seek_to_position(pipeline, seek_time_sec):
    # Convert seconds to nanoseconds
    seek_time_ns = seek_time_sec * Gst.SECOND
    # Seek when the pipeline is in a PAUSED state for faster performance
    pipeline.set_state(Gst.State.PAUSED)
    # Perform the seek
    result = pipeline.seek_simple(Gst.Format.TIME, Gst.SeekFlags.FLUSH | Gst.SeekFlags.KEY_UNIT, seek_time_ns)
    if not result:
        print(f"Failed to seek to {seek_time_sec} seconds.")
    # Resume playing after seeking
    pipeline.set_state(Gst.State.PLAYING)

# Start playing
pipeline.set_state(Gst.State.PLAYING)

# Seek to 50 seconds after a brief delay
GLib.timeout_add_seconds(1, seek_to_position, pipeline, 50)

# Run the main loop
loop = GLib.MainLoop()
try:
    loop.run()
except KeyboardInterrupt:
    pass
finally:
    # Clean up
    pipeline.set_state(Gst.State.NULL)

