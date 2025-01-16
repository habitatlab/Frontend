const express = require("express")

const DailyLog = require("./models/DailyLog") 
const Animal = require("./models/Animal")
const User = require("./models/User")
const Recordings = require ("./models/Recordings")
const Trackings = require ("./models/Trackings")
const router = express.Router()

// Get all daily logs
router.get("/dailylogs", async (req, res) => {
   try {
      const dailyLogs = await DailyLog.find()
      res.send(dailyLogs)
   } catch {
      res.status(404)
      res.send({ error: "Post doesn't exist!" })
   }
})

router.get("/login", async (req, res) => {
    try {
	 User.findOne({ username: req.body.username, password: req.body.password }).then(
	      function (user) {
		    console.log(user)
		    res.send("true")
	      })
      } catch {
		  res.status(404)
	          res.send({ error: "User doesn't exist or login doesn't work" })
      }
})

router.get("/animal", async (req, res) => {
   try {
       const animal = await Animal.find()
       res.send(animal)
   } catch (e) {
       console.log (e)
       res.status(404)
       res.send({ error: "Animals collection doesn't exist" })
   }
})

router.post("/dailylogs", async (req, res) => {
   if (Object.keys(req.body).length>0) {
	   var logs = []
	   var moo = Object.keys(req.body)
	   var results = [];
     for (var i=0; i<moo.length; i++) {
   const dailyLog = new DailyLog({
	researcher_provided_food: req.body[i].researcher_provided_food,
	animal_number: req.body[i].animal_number,
	cage: req.body[i].cage,
	animal: req.body[i].animal,
	weight: req.body[i].weight,
	date: req.body[i].date,
	weight_food_given: req.body[i].weight_food_given,
	time_food_given: req.body[i].time_food_given,
	initials: req.body[i].initials,
	comments: req.body[i].comments
   })
     results.push(req.body[i])
     let log = await dailyLog.save()
     logs.push(log)
   }
	 console.log(logs)
      res.send(logs)
   }
})

router.post("/animal", async (req, res) => {
	var results = [];
	    const animal = new Animal({
		 animal_id: req.body[0].animal_id,
		 name: req.body[0].name,
		 room: req.body[0].room,
		 cage_number: req.body[0].cage_number,
		 rci_number: req.body[0].rci_number,
		 "birth_date": req.body[0].birth_date,
		 start_date: req.body[0].start_date,
		 active: req.body[0].active,
		 weight: req.body[0].weight,
		 sex: req.body[0].sex,
            })
	    results.push(req.body[0])
            await animal.save()
	    res.send(results)
})

router.post("/query", async (req, res) => {
 try {
      console.log(req.body)
     const locations = await Trackings.find({
          start_timestamp: { $gte:  new Date(req.body.startDate+"Z") },
          end_timestamp: { $lte:  new Date(req.body.endDate+"Z") }
    });
     const result = {
	 "tracking": locations
     }
      res.send(result)

   } catch (e) {
      console.log(e)
      res.status(404)
      res.send({ error: "Problem querying recordings" })
   }
})

router.get("/experiments", async (req, res) => {
 try {
     console.log("sdsdgsfd")
     const experiments = await Recordings.find({
    });
     const result = {
         "experiments": experiments 
     }
      res.send(result)

   } catch (e) {
      console.log(e)
      res.status(404)
      res.send({ error: "Problem querying recordings" })
   }
})

router.put("/dailylogs", async (req, res) => {
    try {
        DailyLog.findOne({ _id: req.body._id }).then(
	    function (dailylog) {
                dailylog.cage = req.body.cage
		dailylog.researcher_provided_food = req.body.researcher_provided_food
	        dailylog.animal = req.body.animal
		dailylog.animal_number = req.body.animal_number
	        dailylog.weight = req.body.weight
                dailylog.date = req.body.date
                dailylog.weight_food_given = req.body.weight_food_given
                dailylog.time_food_given = req.body.time_food_given
                dailylog.initials = req.body.initials
                dailylog.comments = req.body.comments

	        dailylog.save().then(function(doc) {
	                   res.send(dailylog)
	           })
	     })
    } catch {
	res.status(404)
        res.send({ error: "DailyLog doesn't exist!" })
    }
})

router.put("/animal", async (req, res) => {
    try {
        Animal.findOne({ animal_id: req.body.animal_id }).then(
	    function (animal) {
                animal.name = req.body.name,
		animal.room = req.body.room,
	        animal.rci_number = req.body.rci_number,
	        animal.cage_number = req.body.cage_number,
	        animal.birth_date = req.body.birth_date,
	        animal.start_date = req.body.start_date,
	        animal.active = req.body.active,
	        animal.weight = req.body.weight,
		animal.sex = req.body.sex,
                animal.save().then(function(doc) {									  res.send(animal)
		})             
	    })
    } catch {
	    res.status(404)
	    res.send({ error: "Animal doesn't exist!" })
    }
})

router.delete("/dailylogs", async (req, res) => {
    try {
	console.log(req.query.id)
        await DailyLog.deleteOne({ _id: req.query.id })
	res.send(req.query.id)
    } catch {
        res.status(404)
	res.send({ error: "Post doesn't exist!" })
    }
})

router.delete("/animal", async (req, res) => {
    try {
	console.log("TEST")
	console.log(req.query.name)
	await Animal.deleteOne({ name: req.query.name })
        res.send(req.query.name)
     } catch {
	res.status(404)
	res.send({ error: "Post doesn't exist!" })
    }
})


module.exports = router
