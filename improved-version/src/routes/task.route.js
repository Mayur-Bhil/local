import express from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskWithId,
  deleteTask,
  getTasksByStatus,
  getTaskStats
} from '../controllers/Taskcontroller.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticateToken);

// Task CRUD operations
router.post('/create', createTask);                    // POST /api/tasks - Create task
router.get('/', getAllTasks);                   // GET /api/tasks - Get all user tasks
router.get('/stats', getTaskStats);             // GET /api/tasks/stats - Get user task statistics
router.get('/status/:status', getTasksByStatus); // GET /api/tasks/status/pending - Get tasks by status
router.get('/:id', getTaskById);                // GET /api/tasks/:id - Get single task
router.put('/:id', updateTaskWithId);           // PUT /api/tasks/:id - Update task
router.delete('/:id', deleteTask);              // DELETE /api/tasks/:id - Delete task

export default router;