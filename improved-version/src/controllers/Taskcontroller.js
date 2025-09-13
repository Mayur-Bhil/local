import Task from "../model/tasks.model.js";

// Create a new task for authenticated user
export const createTask = async (req, res) => {
  try {
    const { title, description, status ,priority,tags} = req.body;

    // Validate required fields
    if (!title || !description || !priority || !tags ) {
      return res.status(400).json({
        message: "enter all required fields",
        success: false,
      });
    }

    // Validate status if provided
    const validStatuses = ['pending', 'in-progress', 'done'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`,
        success: false,
      });
    }

    const priorityCanbe = ["low", "medium", "high"]

    if(priority && !priorityCanbe.includes(priority)){
      return res.status(400).json({
          message: `Invalid Priority. Valid priorites are: ${priorityCanbe.join(', ')}`,
          success: false,
      })
    }

    const payload = {
      title,
      description,
      status: status || 'pending', 
      user: req.userId,
      priority: priority || "medium",
      tags:tags 
    };

    console.log("Creating task payload:", payload);

    const task = new Task(payload);
    const savedTask = await task.save();

    // Populate user info in response
    await savedTask.populate('user', 'name email priority tags');

    return res.status(201).json({
      message: "Task created successfully",
      data: savedTask,
      success: true,
    });
  } catch (error) {
    console.log("Create Task Error:", error);
    return res.status(500).json({
      error: error.message,
      message: "Something went wrong while creating task",
      success: false,
    });
  }
};

// Get all tasks for authenticated user only
export const getAllTasks = async (req, res) => {
  try {
    // Only get tasks for the authenticated user
    const tasks = await Task.find({ user: req.userId })
      .populate('user', 'name email priority tags')
      .sort({ createdAt: -1 }); // Most recent first

    return res.status(200).json({
      message: "Tasks retrieved successfully",
      data: tasks,
      count: tasks.length,
      success: true,
    });
  } catch (error) {
    console.log("Get All Tasks Error:", error);
      return res.status(500).json({
      error: error.message,
      message: "Something went wrong while fetching tasks",
      success: false,
    });
  }
};

// Get single task by ID (only if user owns it)
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find task and ensure it belongs to the authenticated user
    const task = await Task.findOne({ _id: id, user: req.userId })
      .populate('user', 'name email priority tags');

    if (!task) {
      return res.status(404).json({
        message: "Task not found or you don't have permission to access it",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Task retrieved successfully",
      data: task,
      success: true,
    });
  } catch (error) {
    console.log("Get Task By ID Error:", error);
    return res.status(500).json({
      error: error.message,
      message: "Something went wrong while fetching task",
      success: false,
    });
  }
};

// Update task by ID (only if user owns it)
export const updateTaskWithId = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status ,priority,tags} = req.body;

    // Check if task exists and belongs to user
    const existingTask = await Task.findOne({ _id: id, user: req.userId });
    
    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found or you don't have permission to update it",
        success: false,
      });
    }

    const priorityCanbe = ["low", "medium", "high"]

    if(priority && !priorityCanbe.includes(priority)){
      return res.status(400).json({
          message: `Invalid Priority. Valid priorites are: ${priorityCanbe.join(', ')}`,
          success: false,
      })
    }

    // Validate status if provided
    const validStatuses = ['pending', 'in-progress', 'done'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`,
        success: false,
      });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if(status !== undefined) updateData.priority = priority;
    if(status !== undefined)updateData.tags= tags;

    // If no fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "At least one field (title, description, status) is required to update",
        success: false,
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true, // Return updated document
        runValidators: true // Run schema validations
      }
    ).populate('user name email priority tags');

    return res.status(200).json({
      message: "Task updated successfully",
      data: updatedTask,
      success: true,
    });
  } catch (error) {
    console.log("Update Task Error:", error);
    return res.status(500).json({
      error: error.message,
      message: "Something went wrong while updating task",
      success: false,
    });
  }
};

// Delete task by ID (only if user owns it)
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete task only if it belongs to the user
    const deletedTask = await Task.findOneAndDelete({ 
      _id: id, 
      user: req.userId 
    });

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found or you don't have permission to delete it",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully",
      data: deletedTask,
      success: true,
    });
  } catch (error) {
    console.log("Delete Task Error:", error);
    return res.status(500).json({
      error: error.message,
      message: "Something went wrong while deleting task",
      success: false,
    });
  }
};

// Get tasks by status for authenticated user
export const getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ['pending', 'in-progress', 'done'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`,
        success: false,
      });
    }

    const tasks = await Task.find({ 
      status: status,
      user: req.userId // Only get tasks for authenticated user
    })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

    return res.status(200).json({
      message: `Tasks with status '${status}' retrieved successfully`,
      data: tasks,
      count: tasks.length,
      success: true,
    });
  } catch (error) {
    console.log("Get Tasks By Status Error:", error);
    return res.status(500).json({
      error: error.message,
      message: "Something went wrong while fetching tasks by status",
      success: false,
    });
  }
};

// Get task statistics for authenticated user
export const getTaskStats = async (req, res) => {
  try {
    const userId = req.userId;

    const stats = await Task.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format stats into a more readable format
    const formattedStats = {
      pending: 0,
      'in-progress': 0,
      done: 0,
      total: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
    });

    return res.status(200).json({
      message: "Task statistics retrieved successfully",
      data: formattedStats,
      success: true,
    });
  } catch (error) {
    console.log("Get Task Stats Error:", error);
    return res.status(500).json({
      error: error.message,
      message: "Something went wrong while fetching task statistics",
      success: false,
    });
  }
};