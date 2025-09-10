import e from "express";
import express, { response } from "express";

const app = express();
const port  = 8080;
let Tasks = [
     {
    id: 1,
    title: "go to gym",
    description: "you should go gym daily",
    status: "pending",
    createdAt: "2025-09-02T18:45:00Z",
    deadline: "2025-09-09T17:00:00.000Z"
  },
  {
    id: 2,
    title: "Finish MERN project",
    description: "Complete backend and integret frontend",
    status: "in-progress",
    createdAt: "2025-09-01T15:20:00Z",
    deadline: "09/08/25"
  },
  {
    id: 3,
    title: "Workout session",
    description: "Attend evening yoga class at 7 PM",
    status: "completed",
    createdAt: "2025-08-31T07:30:00Z",
    deadline: "09/08/25"

  },
  {
    id: 4,
    title: "Finish MERN project e",
    description: "Complete backend and integret frontend",
    status: "in-progress",
    createdAt: "2025-09-01T15:20:00Z",
    deadline: "2025-09-05T17:00:00.000Z"

  },
  {
    id: 5,
    title: "Finish MERN project",
    description: "Complete backend and integret frontend",
    status: "in-progress",
    createdAt: "2025-09-01T15:20:00Z",
    deadline: "Mon Sep 08 2025 14:19:24 GMT+0530 (India Standard Time)"

  },
  {
    id: 6,
    title: "Finish MERN project 3",
    description: "Complete backend and integret frontend with Gsap",
    status: "completed",
    createdAt: "2025-09-01T15:20:00Z",
    deadline: "2025-09-05T17:00:00.000Z"

  },
];


app.use(express.json())



app.get("/",(req,res)=>{
    return res.json({
        message:" hi there !"
    })
})

app.get("/task",(req,res)=>{
    const data =  Tasks.map((e)=>{
            return e;
    })
    return res.json({
        data:data
    })
})

app.get("/task/:id",(req,res)=>{
    const id = req.params.id;
    const todos = Tasks.find((elem)=>elem.id == id);
    console.log(todos);
    res.json({
        data : todos
    })

})

app.post("/create",(req,res)=>{

    const {title,description,status,id}  = req.body;
    
    const newTodo = {
        id:id,
        title:title,
        description:description,
        status:status || pending,
    }

    Tasks.push();
    return res.json({
        Data : newTodo
    })
})

app.delete("/delete/:id",(req,res)=>{
    const id =  req.params.id;
    const indexTOremove = Tasks.find((el) => el.id == id);
    
    if(indexTOremove > -1){
        return res.json("Not found");
    }
    const deletedItem =  Tasks.splice(indexTOremove,1);
    res.json(deletedItem[0])

    
    


})

app.put("/update/:id",(req,res)=>{
    const id = req.params.id;
    const tasks = Tasks.find((el)=>el.id == id);

    const {title,description,status} = req.body;
    tasks.title = title 
    tasks.description = description
    tasks.status = status


    res.send(tasks);
})


app.get("/search",(req,res)=>{
    let query = req.query?.title;
    console.log(query);
    const filterdata = Tasks.filter(item=>{
        console.log(item);
        
        const ans = item.title.toLowerCase().includes(query.toLowerCase())  || item.description.toLowerCase().includes(query.toLocaleLowerCase())
        
        return ans;
    })

    if(filterdata.length === 0){
        return res.json({
            message : `No Data Found for this '${query}' Task`
        })
    }

    return res.json({
        data : filterdata 
    });
})




app.patch("/tasks/:id",(req,res)=>{
    const id = req.params.id;
    const status = req.query.status;
    // console.log("id is ", id);
    // console.log(status);
    
    const TaskWithUpdatedStatus = Tasks.find((el)=>el.id == id)
    // console.log(status);


      TaskWithUpdatedStatus.status = status


    return res.json({
       message : "Updated SuccessFully",
       data:TaskWithUpdatedStatus
    
    })


})

app.get("/tasks",(req,res)=>{
    const status = req.query.status;
    // const arr = []


    const filteredTasks = Tasks.filter((el) => el.status === status);
    console.log(filteredTasks);

    // for (let i = 0; i < Tasks.length; i++) {
    //         if(Tasks[i].status === status){
    //             arr.push(Tasks[i])
    //         }  
    // }

    

    return res.status(200).json({
        message :`all the '${status}' tasks are`,
        data:filteredTasks
    })
})


app.get("/tasks/overdue",(req,res)=>{
    const today = new Date();
    // console.log("Today's Data is ",today);
    
    const allTasks = Tasks.filter((el)=>{
        const deadlineTaskDate = new Date(el.deadline);
        return deadlineTaskDate < today
    })
    
       return res.json({
        tasks : allTasks
    })
})


app.get("/tasks/getDeadline", (req, res) => {
  const { sort } = req.query;
  console.log(sort);
  

  let result = [...Tasks]; // copy so original array is safe

  if (sort === "deadline") {
    result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  }

  res.json(result);
});

app.get("/tasks/get",(req,res)=>{
    const date = req.query?.date;
    console.log(date);
    
    // const today = new Date();
    const TodaydeadlineTasks = Tasks.filter((e)=>e.deadline == date);
    

    console.log(TodaydeadlineTasks);
    
    res.json({data:TodaydeadlineTasks});

})

app.delete("/tasks/completed", (req, res) => {
   
    
    const RemainingTasks = Tasks.filter(task => task.status == "completed");
    Tasks = Tasks.filter(task => task.status !== "completed");

   
    
    res.json({
        message: `Deleted completed tasks`,
        Tasks,
        RemainingTasks
    });
});

app.listen(port,()=>{
    console.log(`server is runnign on PORT ${port}`);
    
});
