const mongoose = require("mongoose")

const schema = mongoose.Schema({
    "timestamp": Date,
})

module.exports = mongoose.model("video_recordings", schema)
