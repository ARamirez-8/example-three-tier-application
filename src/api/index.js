const express = require('express');
const db = require('./db');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// GET /tasks — list all tasks
app.get('/tasks', async (_req, res) => {
  const { rows } = await db.query('SELECT * FROM tasks ORDER BY created_at ASC');
  res.json(rows);
});

// POST /tasks — create a task
app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  const { rows } = await db.query(
    'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
    [title.trim()]
  );
  res.status(201).json(rows[0]);
});

// PATCH /tasks/:id — update a task (complete/uncomplete or rename)
app.patch('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { completed, title } = req.body;

  const { rows } = await db.query('SELECT * FROM tasks WHERE id = $1', [id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Not found' });

  const current = rows[0];
  const newCompleted = completed !== undefined ? Boolean(completed) : current.completed;
  const newTitle = title !== undefined ? title.trim() : current.title;

  const { rows: updated } = await db.query(
    'UPDATE tasks SET completed = $1, title = $2 WHERE id = $3 RETURNING *',
    [newCompleted, newTitle, id]
  );
  res.json(updated[0]);
});

// GET /todos — find all TODO comments in the codebase
// TODO: Add pagination for large codebases
app.get('/todos', (_req, res) => {
  const todos = [];
  const codebaseRoot = path.join(__dirname, '..');
  const ignoreDirs = ['.git', 'node_modules', '.next', 'dist', 'build', '.terraform'];

  function searchDirectory(dir) {
    try {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (ignoreDirs.includes(file)) continue;
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          searchDirectory(filePath);
        } else if (
          file.endsWith('.ts') ||
          file.endsWith('.tsx') ||
          file.endsWith('.js') ||
          file.endsWith('.jsx') ||
          file.endsWith('.py') ||
          file.endsWith('.go') ||
          file.endsWith('.java')
        ) {
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            lines.forEach((line, index) => {
              const todoMatch = line.match(/TODO[:\s]+(.*?)(?:$|\/\/|#)/);
              if (todoMatch) {
                todos.push({
                  file: path.relative(codebaseRoot, filePath),
                  line: index + 1,
                  text: todoMatch[1].trim(),
                });
              }
            });
          } catch (e) {
            // Skip files that can't be read
          }
        }
      }
    } catch (e) {
      // Skip directories that can't be read
    }
  }

  searchDirectory(codebaseRoot);
  res.json(todos);
});

app.listen(PORT, () => {
  console.log(`API listening on port ${PORT}`);
});
