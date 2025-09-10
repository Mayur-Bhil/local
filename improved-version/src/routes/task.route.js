import { Router } from "express";
import  {createTask,getAllTasks}  from "../controllers/Taskcontroller.js";
const taskRouter = Router();


taskRouter.post("/create",createTask);
taskRouter.get("/getalltasks",getAllTasks)


export default taskRouter;