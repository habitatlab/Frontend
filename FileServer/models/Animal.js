const mongoose = require("mongoose")

const schema = mongoose.Schema({
    "animal_id": String,
    "name": String,
    "cage_number": String,
    "animal_number": String,
    "room" : String,
    "sex": String,
    "birth_date": Date,
    "start_date": Date,
    "weight": String,
    "active": String,
})

module.exports = mongoose.model("Animal", schema)
