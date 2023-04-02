const jwt = require("jsonwebtoken")
const User = require("../model/User")

const auth = async (req,res,next) => {
    
    
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        console.log("token ->",token)
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        console.log("decode token ->", decode)
        const user = await User.findOne({_id : decode._id, "tokens.token" : token})

        if (!user) {
            throw new Error()
        }

        // ilagay yung user doc at token sa req para hindi na magquery si route handler
        req.token = token
        req.user = user
        next()

    }catch(e) {
        res.status(500).send("Please be authorized")
    }
}

module.exports = auth