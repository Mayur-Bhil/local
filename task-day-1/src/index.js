import express from "express";

const app = express();
const port  = 8080;
const Tasks = [
     {
    id: 1,
    title: "Buy groceries",
    description: "Milk, eggs, bread, and vegetables from supermarket",
    status: "pending",
    createdAt: "2025-09-02T18:45:00Z"
  },
  {
    id: 2,
    title: "Finish MERN project",
    description: "Complete backend API and connect it with React frontend",
    status: "in-progress",
    createdAt: "2025-09-01T15:20:00Z"
  },
  {
    id: 3,
    title: "Workout session",
    description: "Attend evening yoga class at 7 PM",
    status: "completed",
    createdAt: "2025-08-31T07:30:00Z"
  }
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
    el.title = title 
    el.description = description
    el.status = status


    res.send(tasks);
})








app.listen(port,()=>{
    console.log(`server is runnign on PORT ${port}`);
    
});
