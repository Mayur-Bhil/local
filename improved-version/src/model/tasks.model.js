import mongoose, { Schema,model } from "mongoose";

const TaskSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["pending", "in-progress", "done"],
        default:"pending"
    },

},{
    timestamps:true
})


const Task = mongoose.model("Task",TaskSchema);


export default Task