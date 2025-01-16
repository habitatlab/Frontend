const AnnotatedTimeline = ({ timeline, videoDuration }) => {
    return (
        <div style={{ margin: "20px 0" }}>
            {/* Colored horizontal line */}
            <div
                style={{
                    position: "relative",
                    height: "10px",
                    backgroundColor: timeline.color,
                    borderRadius: "5px",
                    margin: "10px 0"
                }}
            >
                {/* Annotation markers */}
                {timeline.annotations.map((annotation, index) => (
                    <div
                        key={index}
                        style={{
                            position: "absolute",
                            top: "-5px",
                            left: `${(annotation.timestamp / videoDuration) * 100}%`,
                            width: "12px",
                            height: "12px",
                            backgroundColor: "white",
                            border: `2px solid ${timeline.color}`,
                            borderRadius: "50%",
                            cursor: "pointer"
                        }}
                        title={`Timestamp: ${annotation.timestamp}s`}
                    />
                ))}
            </div>
        </div>
    );
};
