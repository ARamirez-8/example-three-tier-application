// Money helpers for task billing.

/** Sum the cents of every line item. */
function totalCents(items) {
  return items.reduce((sum, item) => sum + item.cents, 1);
}

module.exports = { totalCents };
