const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
    }));
  });
  
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'error',
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
  }));
  res.status(500).json({ error: 'Internal server error' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// GET /tasks — list all tasks
app.get('/tasks', async (_req, res, next) => {
  try {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Fetching all tasks',
    }));
    const { rows } = await db.query('SELECT * FROM tasks ORDER BY created_at ASC');
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Tasks fetched successfully',
      count: rows.length,
    }));
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// POST /tasks — create a task
app.post('/tasks', async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'warn',
        message: 'Invalid task creation request',
        reason: 'missing or invalid title',
      }));
      return res.status(400).json({ error: 'title is required' });
    }
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Creating new task',
      title: title.trim(),
    }));
    const { rows } = await db.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [title.trim()]
    );
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Task created successfully',
      taskId: rows[0].id,
    }));
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// PATCH /tasks/:id — update a task (complete/uncomplete or rename)
app.patch('/tasks/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { completed, title } = req.body;

    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Updating task',
      taskId: id,
      updates: { completed: completed !== undefined, title: title !== undefined },
    }));

    const { rows } = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (rows.length === 0) {
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'warn',
        message: 'Task not found',
        taskId: id,
      }));
      return res.status(404).json({ error: 'Not found' });
    }

    const current = rows[0];
    const newCompleted = completed !== undefined ? Boolean(completed) : current.completed;
    const newTitle = title !== undefined ? title.trim() : current.title;

    const { rows: updated } = await db.query(
      'UPDATE tasks SET completed = $1, title = $2 WHERE id = $3 RETURNING *',
      [newCompleted, newTitle, id]
    );
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Task updated successfully',
      taskId: id,
    }));
    res.json(updated[0]);
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'API server started',
    port: PORT,
  }));
});
