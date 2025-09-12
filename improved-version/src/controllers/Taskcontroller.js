import Task from "../model/tasks.model.js";
import US

export const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !description || !status) {
      return res.status(400).json({
        message: "All fields (title, description, status) are required",
        success: false,
      });
    }

    const payload = {
      title,
      description,
      status,
      user: req.userId, 
    };

    console.log("payload", payload);

    const task = new Task(payload);
    const savedTask = await task.save();

    return res.json({
      message: "Created Successfully",
      data: savedTask,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
      message: "Something went wrong",
    });
  }
};


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