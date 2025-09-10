import Task from "../model/tasks.model.js";

export const createTask = async(req,res)=>{
       try {
        const {title,description,status} = req.body;
        

        if(!title || !description || !status){
            return res.json({
                error
            })
        }
        const payload = {
            title:title,
            description:description,
            status:status
        }
        console.log("payload", payload);
        const task = new Task(payload)
        const savTask = await task.save();

        return res.json({
            message:"Createdd SUccessFully",
            data : savTask
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error,
            message: "Something went wrong"
        })
    }
}

export const getAllTasks = async(req,res)=>{
   try {
         const tasks = await Task.find();
        return res.json({
            data:tasks
        })
   } catch (error) {
        console.log(error);
        
   }
}


export const updateTaskWiithId = async(req,res) =>{
    const id = req.params.id;
}