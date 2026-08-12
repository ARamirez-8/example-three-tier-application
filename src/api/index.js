const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const originalSend = res.send;

  res.send = function (data) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const level = statusCode >= 400 ? 'ERROR' : 'INFO';
    console.log(`[${level}] ${req.method} ${req.path} - ${statusCode} (${duration}ms)`);
    return originalSend.call(this, data);
  };

  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[ERROR] Unhandled error on ${req.method} ${req.path}:`, err.message);
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// GET /tasks — list all tasks
app.get('/tasks', async (_req, res, next) => {
  try {
    console.log('[DEBUG] Fetching all tasks from database');
    const { rows } = await db.query('SELECT * FROM tasks ORDER BY created_at ASC');
    console.log(`[DEBUG] Retrieved ${rows.length} tasks`);
    res.json(rows);
  } catch (err) {
    console.error('[ERROR] Failed to fetch tasks:', err.message);
    next(err);
  }
});

// POST /tasks — create a task
app.post('/tasks', async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || !title.trim()) {
      console.log('[WARN] POST /tasks rejected: invalid or missing title');
      return res.status(400).json({ error: 'title is required' });
    }
    console.log(`[DEBUG] Creating task with title: "${title.trim()}"`);
    const { rows } = await db.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [title.trim()]
    );
    console.log(`[DEBUG] Task created with id: ${rows[0].id}`);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('[ERROR] Failed to create task:', err.message);
    next(err);
  }
});

// PATCH /tasks/:id — update a task (complete/uncomplete or rename)
app.patch('/tasks/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { completed, title } = req.body;

    console.log(`[DEBUG] Updating task ${id}: completed=${completed}, title=${title}`);
    const { rows } = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (rows.length === 0) {
      console.log(`[WARN] PATCH /tasks/${id} - task not found`);
      return res.status(404).json({ error: 'Not found' });
    }

    const current = rows[0];
    const newCompleted = completed !== undefined ? Boolean(completed) : current.completed;
    const newTitle = title !== undefined ? title.trim() : current.title;

    console.log(`[DEBUG] Updating task ${id}: completed ${current.completed} -> ${newCompleted}, title "${current.title}" -> "${newTitle}"`);
    const { rows: updated } = await db.query(
      'UPDATE tasks SET completed = $1, title = $2 WHERE id = $3 RETURNING *',
      [newCompleted, newTitle, id]
    );
    console.log(`[DEBUG] Task ${id} updated successfully`);
    res.json(updated[0]);
  } catch (err) {
    console.error('[ERROR] Failed to update task:', err.message);
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`[INFO] API listening on port ${PORT}`);
});
