import express from "express";

const app = express();
const port  = 8080;
const Tasks = [
    {
     id:"123",
     title: "go to gym",       // required
     description: "Daily should have top go gym", // optional
     status: "pending",      // default: "pending", values: ["pending", "in-progress", "done"]
     createdAt: new Date().getDate(),     // default: current date
    },{
     id:"3264",    
     title: "Write Code",       // required
     description: "Write Code For 3 hours daily", // optional
     status: "pending",      // default: "pending", values: ["pending", "in-progress", "done"]
     createdAt: new Date().getDate(),     //
    }
]
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
    const id  =  req.params.id;
    console.log(id);
   
    const data = Tasks.filter((elem)=>{
       return elem.id==id
    })

    return res.json({
        data
    })
    
})


app.post("/create",(req,res)=>{
    const task  = req.body;

    console.log(task);
    
    return res.json({
        message :task
    })
})

app.delete("/delete/:id",(req,res)=>{
    const id =  req.params.id;
    
    const index = Tasks.splice(id);
    console.log(index);
    


})

app.get("/update/:id",(req,res)=>{
    const id = req.params.id;
    // const {title,description,status,createdAt} = req.body;

    const data = Tasks.map((el)=>{
        console.log(el);
        if(Tasks[el.id] == id){
            
        }
        
    })
})









app.listen(port,()=>{
    console.log(`server is runnign on PORT ${port}`);
    
});
