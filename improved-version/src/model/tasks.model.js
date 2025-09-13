import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "done"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    tags: {
      type: [String], 
      default: [],
    },
    deadline: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware: set completedAt when status = "done"
TaskSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "done") {
    this.completedAt = new Date();
  }
  next();
});

const Task = mongoose.model("Task", TaskSchema);
export default Task;
