import express from "express";
import mongoose,{Model, Schema,model} from "mongoose";

const taskSchema = new Schema({
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
        },
        status:{
            type:String,
            enum:["pending", "in-progress", "done"]
        },

},{
    timestamps:true
})


const Task = Model("Task",taskSchema);