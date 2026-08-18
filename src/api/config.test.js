const { test } = require('node:test');
const assert = require('node:assert');
const { DEFAULT_ROUTING_MODE } = require('./config');

test('Configuration - DEFAULT_ROUTING_MODE should be auto_route', () => {
  assert.strictEqual(DEFAULT_ROUTING_MODE, 'auto_route');
});
