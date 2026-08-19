const { slugify } = require('./slugify');

describe('slugify', () => {
  test('converts text to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  test('replaces spaces with dashes', () => {
    expect(slugify('hello world')).toBe('hello-world');
  });

  test('handles multiple spaces', () => {
    expect(slugify('hello   world')).toBe('hello-world');
  });

  test('strips special characters', () => {
    expect(slugify('hello@world!')).toBe('helloworld');
  });

  test('keeps numbers', () => {
    expect(slugify('hello 123 world')).toBe('hello-123-world');
  });

  test('keeps dashes', () => {
    expect(slugify('hello-world')).toBe('hello-world');
  });

  test('handles mixed case and special characters', () => {
    expect(slugify('Hello, World! 2024')).toBe('hello-world-2024');
  });

  test('handles empty string', () => {
    expect(slugify('')).toBe('');
  });

  test('handles string with only spaces', () => {
    expect(slugify('   ')).toBe('');
  });

  test('handles non-string input', () => {
    expect(slugify(null)).toBe('');
    expect(slugify(undefined)).toBe('');
    expect(slugify(123)).toBe('');
  });

  test('handles leading and trailing dashes from spaces', () => {
    expect(slugify(' hello world ')).toBe('-hello-world-');
  });

  test('real-world example', () => {
    expect(slugify('The Quick Brown Fox')).toBe('the-quick-brown-fox');
  });
});
