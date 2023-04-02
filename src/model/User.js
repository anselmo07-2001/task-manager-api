const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const Task = require("../model/Task")

// Creating schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        index: true,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        trim: true,
        validate(value) {
            if (value.toLowerCase().match("password")) {
                throw new Error("Password cannot contain the word password")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be positive")
            }
        }
    },
    tokens: [{
        token: {
            type: "String",
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})


// Creating instances method for hiding password/token property
// toJSON(), sya yung nagdedecide kung papano iseserialize(object to string) ni
// JSON.stringify yung object. toJSON() change the outputted through JSON.stringify
// lahat ng userSchema object nyan dito ay mabubura nayung password/field, no need tawagin yung function
// yung return value is maseserialize automatically nanyayari dahil ito kay mongoose
// nag rurun ito when we res.send() yung user object
userSchema.methods.toJSON = function() {
    const user = this
    const userProfile = user.toObject()
    delete userProfile.password
    delete userProfile.tokens
    delete userProfile.avatar
    
    return userProfile
}


userSchema.virtual("task", {
    ref: "Task", // dito naman sinasabi kanino pakikipag relation si User model, si User model makikipag relation kay Task model
    localField : "_id",  // yung _id ay ng galing mismo sa property ni User Model
    foreignField : "owner" // yung owner ay na galing sa property ng Task
})


// ganito syntax ng middleware sa mongoose
userSchema.pre("save", async function(next) {
    const user = this

    console.log("middleware run before saving", user)

    //isModifield() check if yung field na password ay inaaupdate, or kinicreated
    //if true then hash the password
    if (user.isModified("password")) {
        const hashedPassword = await bcrypt.hash(user.password, 8)
        console.log("hashed password :", hashedPassword)
        user.password = hashedPassword
    }

    //yung next() ginagamit to tell that this middleware is tapos na
    //without next() forever lng magrurun itong middleware nato
    next()
})


userSchema.pre("remove", async function(next) {
    const user = this
    await Task.deleteMany({owner : user._id})
    next()
})


userSchema.methods.generateTokens = async function() {
    const user = this
    const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET)
    
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}


// static custom schema funtions or model methods
userSchema.statics.findByCredential = async(email, password) => {

    const user = await User.findOne({email})
    console.log("gettingn the email from the schema", user)


    if (!user) {
        // onces nag throw ka ng error, maiistop na yung function executions
        console.log("mali email")
        throw new Error("Unabled to connect")
    }

    const isValid = await bcrypt.compare(password, user.password)
        
    if (!isValid) {
        console.log("mali password")
        throw new Error("shit")
    }

    return user
}


//Example pano gumaga ng isang model, dito makikita ang isang field,
// kung anong data type nya, required ba or hindi, and other option
const User = mongoose.model("User", userSchema)

User.createIndexes()

module.exports = User

// example pano gamitin ang model
// const osgar = new User({name: "    osgar  ", password: "dnsksapasDjnjanjn"})
// osgar.save().then((res) => console.log(res))
//           .catch((err) => console.log(err))