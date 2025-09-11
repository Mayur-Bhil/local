import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import taskRouter from "./routes/task.route.js";
import userRouter from "./routes/user.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.json());


app.use("/tasks", taskRouter);
app.use("/users",userRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Server is Up and running"
  });
});

// Connect to DB and then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" Failed to connect to MongoDB", err);
    process.exit(1);
  });
