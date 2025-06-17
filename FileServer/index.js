const express = require("express")
const cors = require('cors')
const mongoose = require("mongoose") // new
const routes = require('./routes')

// Connect to MongoDB database
mongoose
	.connect(':27017/ratburrow?authSource=admin', { useNewUrlParser: true })
        .then(() => {
	    const app = express()
	
            app.use(cors())
	    app.use(express.json()) // new
            app.use(express.static('/'));
	    app.use("/api", routes) // new

	    app.listen(5001, () => {
		console.log("Server has started!")
	    })
	})
