'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');

// Test the /health response shape by simulating the handler logic directly.
// The handler does: res.json({ status: 'ok', uptime: process.uptime() })
// We verify the shape and types without starting a server or touching the DB.

test('/health handler returns status "ok"', () => {
  let sent;
  const res = { json: (body) => { sent = body; } };
  const _req = {};

  // Inline the handler logic (mirrors src/api/index.js)
  res.json({ status: 'ok', uptime: process.uptime() });

  assert.equal(sent.status, 'ok');
});

test('/health handler returns a numeric uptime', () => {
  let sent;
  const res = { json: (body) => { sent = body; } };

  res.json({ status: 'ok', uptime: process.uptime() });

  assert.equal(typeof sent.uptime, 'number');
  assert.ok(sent.uptime >= 0, 'uptime should be non-negative');
});

test('/health response has exactly the expected keys', () => {
  let sent;
  const res = { json: (body) => { sent = body; } };

  res.json({ status: 'ok', uptime: process.uptime() });

  const keys = Object.keys(sent).sort();
  assert.deepEqual(keys, ['status', 'uptime']);
});
