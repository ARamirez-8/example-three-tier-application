/**
 * Convert text to a URL-friendly slug.
 * - Converts to lowercase
 * - Replaces spaces with dashes
 * - Strips anything that is not a letter, number, or dash
 * @param {string} text - The text to slugify
 * @returns {string} The slugified text
 */
function slugify(text) {
  if (typeof text !== 'string') {
    return '';
  }

  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

module.exports = { slugify };
