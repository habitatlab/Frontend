const mongoose = require("mongoose")

const schema = mongoose.Schema({
    "researcher_provided_food": String,
    "animal_number": String,
    "cage": String,
    "animal": String,
    "weight": String,
    "date": Date,
    "weight_food_given": String,
    "time_food_given": String,
    "initials": String,
    "comments": String
})

module.exports = mongoose.model("DailyLog", schema)
