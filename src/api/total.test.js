const test = require('node:test');
const assert = require('node:assert');
const { totalCents } = require('./total.js');

test('totalCents sums the line items', () => {
  assert.strictEqual(totalCents([{ cents: 100 }, { cents: 250 }]), 350);
});

test('totalCents of no items is zero', () => {
  assert.strictEqual(totalCents([]), 0);
});
