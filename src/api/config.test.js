const { test } = require('node:test');
const assert = require('node:assert');
const { DEFAULT_ROUTING_MODE } = require('./config');

test('DEFAULT_ROUTING_MODE should be set to auto_route', () => {
  assert.strictEqual(DEFAULT_ROUTING_MODE, 'auto_route');
});
