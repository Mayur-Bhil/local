import express from "express"
import connectDB from "./config/db.js";
import taskRouter from "./routes/task.route.js";

const app =  express();
const PORT = 8080; 
console.log("port ",PORT );


app.use(express.json())
app.use("/tasks",taskRouter)





app.get("/",(req,res)=>{
    return res.json({
        message: "Server is Up and running"
    })
})







connectDB();
app.listen(PORT,()=>{
        console.log(`App listening ON Port 8080`);
})