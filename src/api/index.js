const express = require('express');
const db = require('./db');
const logger = require('./logger');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
    });
  });
  
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
  });
  res.status(500).json({ error: 'Internal server error' });
});

app.get('/health', (_req, res) => {
  logger.debug('Health check requested');
  res.json({ status: 'ok' });
});

// GET /tasks — list all tasks
app.get('/tasks', async (_req, res, next) => {
  try {
    logger.debug('Fetching all tasks');
    const { rows } = await db.query('SELECT * FROM tasks ORDER BY created_at ASC');
    logger.debug(`Retrieved ${rows.length} tasks`);
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
      logger.warn('Task creation failed: invalid title', { title });
      return res.status(400).json({ error: 'title is required' });
    }
    
    logger.debug(`Creating task with title: "${title.trim()}"`);
    const { rows } = await db.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [title.trim()]
    );
    
    logger.info(`Task created successfully`, { id: rows[0].id, title: rows[0].title });
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

    logger.debug(`Updating task ${id}`, { completed, title });

    const { rows } = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (rows.length === 0) {
      logger.warn(`Task not found for update`, { id });
      return res.status(404).json({ error: 'Not found' });
    }

    const current = rows[0];
    const newCompleted = completed !== undefined ? Boolean(completed) : current.completed;
    const newTitle = title !== undefined ? title.trim() : current.title;

    logger.debug(`Applying changes to task ${id}`, { 
      oldCompleted: current.completed, 
      newCompleted,
      oldTitle: current.title,
      newTitle 
    });

    const { rows: updated } = await db.query(
      'UPDATE tasks SET completed = $1, title = $2 WHERE id = $3 RETURNING *',
      [newCompleted, newTitle, id]
    );
    
    logger.info(`Task updated successfully`, { id, completed: newCompleted, title: newTitle });
    res.json(updated[0]);
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  logger.info(`API listening on port ${PORT}`);
});
