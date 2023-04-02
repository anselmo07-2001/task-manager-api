const express = require("express")
const Task = require("../model/Task")
const auth = require("../middleware/auth")

const router = express.Router()



// Creating Task
router.post("/tasks", auth,async (req,res) => { 

    try {
        const task = new Task({
            ...req.body,
            owner : req.user._id
        })

        const createdTask = await task.save()
        res.status(201).send(createdTask)
    }
    catch(err) {
        res.status(400).send(err)
    }


//    const task = new Task(req.body)
//    task.save().then((res) => res.status(201).send(res))
//               .catch((err) => {
//                   res.status(400).send(err)
//               })
})



// GET /tasks?completed=false
// GET /task?limit=2&skip=0
// GET /task?sortBy=createdAt_asc
router.get("/tasks", auth,async(req,res) => {
    const match = {}
    let sortMode = 1

    if (req.query.completed) {
        match.completed = req.query.completed
    }

    if (req.query.sortBy) {
        req.query.sortBy.endsWith("asc") ? sortMode = 1 : sortMode = -1
    }

    

    try {
        // if (!req.query.completed) {
        //     console.log("completed query string not found")
        //     const tasks = await Task.find({owner : req.user._id})
        //     console.log(tasks)
        //     return res.status(200).send(tasks)
        // }
        

        await req.user.populate({
            path: "task",
            match: match,
            options: {
                limit: +req.query.limit,
                skip: +req.query.skip,
                sort: {
                    createdAt: sortMode
                }
            }
        }).execPopulate()

        console.log(req.user.task)
        res.send(req.user.task)
    }
    catch(err) {
        res.status(500).send(err)
    }


    // Task.find({}).then((tasks) => {
    //     res.status(200).send(tasks)
    // }).catch((err) => {
    //     res.status(500).send(err)
    // })
})


router.get("/tasks/:id", auth,async(req,res) => {
    const _id = req.params.id

    try {
       const task = await Task.findOne({_id, owner: req.user._id})
       if (!task)  return res.status(404).send("Task not found")
       res.send(task)
    }
    catch(err) {
       res.status(500).send(err)
    }

    // Task.findById(_id).then((task) => {
    //     if (!task) {
    //         return res.status(404).send()
    //     }
    // }).catch((err) => {
    //     res.status(500).send(err)
    // })
})


router.patch("/tasks/:id", auth,async(req,res) => {
    const _id = req.params.id
    const updatingField = Object.keys(req.body)
    const allowedProperty = ["description", "completed"]
    
    //kung meron field na hindi name, password, age, magkakaroon ng invalid updates
    const isValid = updatingField.every((field) => {
         return allowedProperty.includes(field)
    })

    if (!isValid) {
        return res.status(400).send({error: "Invalid Updates"})
    }

    try {
       // const updatedTask = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})
        const updatingTask = await Task.findOne({_id, owner: req.user._id})

        if (!updatingTask) {
            return res.status(404).send("Task not found")
        }

        // dito talaga naguupdate
        updatingField.forEach(field => {
            updatingTask[field] = req.body[field]
        })

        await updatingTask.save()
      

       res.send(updatingTask)
    }
    catch(err) {
        res.status(500).send(err)
    }
})


router.delete("/tasks/:id", auth, async(req,res) => {
    console.log("dito ->",req.user._id)
    try {
        const task = await Task.findOneAndDelete({_id : req.params.id, owner: req.user._id})
        if (!task) return res.status(404).send({error: "Task not found"})

        res.send(task)
    }
    catch(err) {
        res.status(500).send(err)
    }
})


module.exports = router



