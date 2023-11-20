const express = require("express")
const cors = require('cors')

// Connect to MongoDB database
	    const app = express()
	
            app.use(cors())
	    app.use(express.json()) // new
            app.use(express.static('../../../opt/VBS'));

	    app.listen(5001, () => {
		console.log("Server has started!")
	    })
