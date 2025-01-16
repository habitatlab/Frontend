import av
import logging

# Enable FFmpeg logging
av.logging.set_level(av.logging.DEBUG)

def decode_video_with_nvdec(video_path):
    # Open the video file with PyAV
    container = av.open(video_path)

    frame_number = 100
    seek_time = frame_number / 20 

    # Select the video stream
    video_stream = container.streams.video[0]
    # Set the codec context to use Nvidia's hardware decoding
    video_stream.codec_context.options = {'hwaccel': 'cuda'}
    container.seek(10, any_frame=False, stream=video_stream)

    frame_count = 0
    for packet in container.demux(video_stream):
        for frame in packet.decode():
            frame_count += 1
            # Save each frame with a unique filename
            image = frame.to_image()
            image.save(f'output_frame_{frame_count}.jpg')
            print(f"Saved frame {frame_count}")

# Example usage:
decode_video_with_nvdec('/nearline/karpova/TervoLab/data/Videos/MouseCityVideos/cohort1_3day/EMERGENT_2002627_20240722_1346_1.mp4')

