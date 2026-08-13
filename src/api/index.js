const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Parse and validate a route :id param.
 * Returns the integer id, or null if the value is not a positive integer.
 */
function parseId(param) {
  const id = parseInt(param, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

/**
 * Central error handler — logs the error and returns a generic 500 so that
 * stack traces are never leaked to the client.
 */
function handleError(res, err) {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// GET /health
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// GET /tasks — list all tasks
app.get('/tasks', async (_req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM tasks ORDER BY created_at ASC');
    res.json(rows);
  } catch (err) {
    handleError(res, err);
  }
});

// POST /tasks — create a task
app.post('/tasks', async (req, res) => {
  const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';

  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }

  try {
    const { rows } = await db.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [title]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    handleError(res, err);
  }
});

// PATCH /tasks/:id — update a task (rename and/or toggle completion)
app.patch('/tasks/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'id must be a positive integer' });
  }

  const { completed, title } = req.body;

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({ error: 'title must be a non-empty string' });
  }

  try {
    const { rows } = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const current = rows[0];
    const newCompleted = completed !== undefined ? Boolean(completed) : current.completed;
    const newTitle = title !== undefined ? title.trim() : current.title;

    const { rows: updated } = await db.query(
      'UPDATE tasks SET completed = $1, title = $2 WHERE id = $3 RETURNING *',
      [newCompleted, newTitle, id]
    );
    res.json(updated[0]);
  } catch (err) {
    handleError(res, err);
  }
});

// DELETE /tasks/:id — remove a task
app.delete('/tasks/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'id must be a positive integer' });
  }

  try {
    const { rowCount } = await db.query('DELETE FROM tasks WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(204).send();
  } catch (err) {
    handleError(res, err);
  }
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
