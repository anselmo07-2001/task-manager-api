const express = require("express")

//Connected na yung mongodb server natin kay moongoose kaya
// kapag nag run na yung mongoose code, kokonecta na sya kay mongodb serever
require("./db/mongoose")

const UserRouter = require("./routers/user")
const TaskRouter = require("./routers/task")

const app = express()
const port = process.env.port

//Example of middleware
// app.use((req,res,next) => {

//     //kapag nag response ka kay user, note na matatapos nayung execution ng route
//     //hindi na magrurun yung next(), magerror ka
//     res.status(503).send("Web is under maintenance")
// })


// ang ginagawa nito ay, lahat ng incoming json sa pumapasok sa server natin
// icocoonvert na agad na object, para maacess natin sila sa req.body
app.use(express.json())

// to use the routers in the index.js
app.use(UserRouter)
app.use(TaskRouter)


app.listen(port, () => {
    console.log("Server is up on port" + port)    
})


//// Playground ////////


// const Task = require("./model/Task")
const User = require("./model/User")

// Dito yung nagququery tayo ng lahat ng task ng isang user, 
// ang goal is iquery ang lahat ng task ni user and yung user profile nya
// kaso 2 times ka magququery, dito isang beses nlng gagamitan mo lng 
// ng virtual interface or adding another fied sa model and using populate().exePopulate()
const main = async() => {
    // const task = await Task.findById("640d8d7d461e062bcc6e7c2e")

    // si populate().exePopulate(), yung owner field ni task, yung magiging value nya na
    // ay hindi nayung owner id, bagkus yung value nya is yung data ng owner na gumawa
    // await task.populate("owner").execPopulate()
    // console.log(task)

    //Another Example using virtual property. Ang goal dito ay maquery lahat ng 
    // task ni User gamit ng User Model, si User model ay may virtual property na yun yung makikipagrelationship sa Task Model
    // const user = await User.findById("640d88c1bf7b760490e5fd72")
    // await user.populate("task").execPopulate()
    // console.log(user.task)
}

main()



// const multer = require("multer")
// const upload = multer({
//     dest: "images"
// })
// app.post("/upload", upload.single("upload") ,(req,res) => {
//     res.send()
// })

