/**
 * Convert text to kebab-case format.
 * - Converts to lowercase
 * - Replaces spaces with dashes
 * - Strips anything that is not a letter, number, or dash
 * @param {string} text - The text to convert
 * @returns {string} The kebab-cased text
 */
function kebab(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

module.exports = { kebab };
