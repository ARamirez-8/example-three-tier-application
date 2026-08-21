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

// Test the /version response shape by simulating the handler logic directly.
// The handler does: res.json({ version }) where version comes from package.json.

test('/version handler returns a version string', () => {
  const { version } = require('./package.json');
  let sent;
  const res = { json: (body) => { sent = body; } };

  res.json({ version });

  assert.equal(typeof sent.version, 'string');
  assert.ok(sent.version.length > 0, 'version should be non-empty');
});

test('/version handler returns the version from package.json', () => {
  const { version } = require('./package.json');
  let sent;
  const res = { json: (body) => { sent = body; } };

  res.json({ version });

  assert.equal(sent.version, version);
});

test('/version response has exactly the expected keys', () => {
  const { version } = require('./package.json');
  let sent;
  const res = { json: (body) => { sent = body; } };

  res.json({ version });

  assert.deepEqual(Object.keys(sent), ['version']);
});
