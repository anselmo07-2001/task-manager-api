const mongoose = require("mongoose")


const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // Dito nagiiestablish tayo ng relationship sa owner field
        // ref: kanino sya makikipag relationship, gagamitin nya yung owner value which is yung id
        // para kapag ginamitan ng populate().execPopulate(), itong field nato, hindi na owner id bagkus yung buong data ng user
        ref: "User"
    }
}, {
    timestamps: true
})



const Task = mongoose.model("Task", taskSchema)




module.exports = Task