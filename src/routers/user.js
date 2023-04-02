const express = require("express")
const multer = require("multer")
const sharp = require("sharp")

const User = require("../model/User")
const auth = require("../middleware/auth")
const sgMail = require("../email/account")

const router = new express.Router()



router.post("/users/login", async(req,res) => {
    try {
        const { email, password } = req.body
        const user = await User.findByCredential(email, password)
        console.log("getting the user from router:", user)

        //insert yung token sa user
        const token = await user.generateTokens()
        
        res.send({user, token})
    }
    catch(err) {
        res.status(400).send(err)
    }
})



router.post("/users/logout", auth, async (req,res) => {
    try {
        // console.log("from endpoint logout", req.user, req.token)
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        // console.log(req.user.tokens)
        await req.user.save()

        res.status(200).send(req.user)
    }
    catch(err) {
        res.status(500).send()
    }
})


router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send(req.user)
    }
    catch(err) {    
        res.status(500).send()
    }
})



// Creating user
router.post("/users", async(req,res) => {
    console.log(req.body)

    try {
        const user = new User(req.body)
        const token = await user.generateTokens()

        const createdUser = await user.save()
        // sgMail.newUserWelcomingEmail(user.email, user.name)
        res.status(201).send({createdUser, token})

    }catch(e) {
        res.status(400).send(e)
    }

    //Alternative code, using then/catch
    // user.save().then((res) => res.status(201).send(res))
    //            .catch((err) => {
    //                res.status(400).send(err)
    //            })

})


const avatar = multer({
    limits : {
        fileSize: 500000
    },
    fileFilter(req,file,cb) {
        if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
             return cb(new Error("File format must be png, jpg or jpeg"))
        }

        cb(undefined, true)
    }
}) 
//4th argument is a callback function na matitriger onces nakaroon ng error dun sa fileFilter
router.post("/users/me/avatar", auth , avatar.single("avatar"), async (req,res) => {
     const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250,
     }).png().toBuffer()

     req.user.avatar = buffer
     await req.user.save()
     res.send()
}, (err,req,res,next) => {
    res.status(400).send({error : err.message})
})


router.delete("/users/me/avatar", auth, async (req,res) => {
    req.user.avatar = undefined
    req.user.save()
    res.send()
})

router.get("/users/:id/avatar", async (req,res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set("Content-Type", "image/png")
        res.send(user.avatar)
    }   
    catch(e) {
        res.status(404).send()
    } 
})



// kunin ang user profile
//note, yung second parameter is the middleware sya muna
//yung magrurun before yung routerhandler
router.get("/users/me",auth,async (req,res) => {
    
   
        
    res.send(req.user)

    //get all user
    // try {
    //     const users = await User.find({})
    //     res.status(200).send(users)
    // }
    // catch(err) {
    //     res.status(404).send(err)
    // }


    // User.find({}).then((users) => {
    //     res.status(200).send(users)
    // }).catch((err) => {
    //     res.status(404).send(err)
    // })
})


// kunin yung specific na user base sa id
router.get("/users/:id", async(req,res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        console.log(user)

        if (!user) return res.status(404).send("User not found")
        res.send(user)

    }
    catch(e) {
        res.status(500).send(e)
    }

    //Alternative code, using then/catch
    // User.findById(_id).then((user) => {
        
    //     //kahit walang nahanap na user base sa id, hindi parin ito magfafailed
    //     //dito chineck natin if nahanap or hindi, if hindi return na
    //     if (!user) {
    //        return res.status(404).send()
    //     }

    //     res.send(user)

    // }).catch((err) => {
    //     res.status(500).send(err)
    // })
})


//  update user
router.patch("/users/me", auth,async(req,res) => {
    // const _id = req.user._id
    const updatingField = Object.keys(req.body)
    const allowedProperty = ["name", "password", "age"]
    
    //kung meron field na hindi name, password, age, magkakaroon ng invalid updates
    const isValid = updatingField.every((field) => {
         return allowedProperty.includes(field)
    })

    if (!isValid) {
        return res.status(400).send({error: "Invalid Updates"})
    }
 
    try {
        // panget ang use of findByIdAndUpdate dahil directly nyang minamanipulate yung database
        // byna bypass nya yung middleware ng mongoose
        //const updatedUser = await User.findByIdAndUpdate(_id, req.body, { new : true, runValidators: true})
        
        // const userUpdating = await User.findById(_id)
        
        //dynamic na iniupdate per iterate yung field
        updatingField.forEach(field => {
            req.user[field] = req.body[field]
        })

        //before nya isasave ito, magrurun muna yung mongoose middle
        await req.user.save()

        res.send(req.user)
    }
    catch(err) {
        res.status(500).send(err)
    }

})

router.delete("/users/me", auth,async(req,res) => {
    try {
        // const deletedUser = await User.findByIdAndDelete(req.params.id)
        // if (!deletedUser) return res.status(404).send({error: "User not found"})
        await req.user.remove()
        sgMail.emailCancelingAccount(req.user.email, req.user.name)

        res.send(req.user)
    }
    catch(err) {
        res.status(500).send(err)
    }
})



module.exports = router