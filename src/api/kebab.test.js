const assert = require('assert');
const { kebab } = require('./kebab');

describe('kebab', () => {
  it('should convert text to lowercase', () => {
    assert.strictEqual(kebab('HELLO'), 'hello');
    assert.strictEqual(kebab('HeLLo'), 'hello');
  });

  it('should replace spaces with dashes', () => {
    assert.strictEqual(kebab('hello world'), 'hello-world');
    assert.strictEqual(kebab('hello  world'), 'hello--world');
  });

  it('should strip non-alphanumeric characters except dashes', () => {
    assert.strictEqual(kebab('hello@world'), 'helloworld');
    assert.strictEqual(kebab('hello!world'), 'helloworld');
    assert.strictEqual(kebab('hello#world'), 'helloworld');
  });

  it('should handle combined transformations', () => {
    assert.strictEqual(kebab('Hello World!'), 'hello-world');
    assert.strictEqual(kebab('Hello @ World #123'), 'hello--world-123');
    assert.strictEqual(kebab('CONVERT THIS TEXT'), 'convert-this-text');
  });

  it('should preserve numbers', () => {
    assert.strictEqual(kebab('hello 123 world'), 'hello-123-world');
    assert.strictEqual(kebab('test123'), 'test123');
  });

  it('should preserve existing dashes', () => {
    assert.strictEqual(kebab('hello-world'), 'hello-world');
    assert.strictEqual(kebab('hello - world'), 'hello---world');
  });

  it('should handle empty strings', () => {
    assert.strictEqual(kebab(''), '');
  });

  it('should handle strings with only special characters', () => {
    assert.strictEqual(kebab('!@#$%'), '');
  });

  it('should handle strings with only spaces', () => {
    assert.strictEqual(kebab('   '), '---');
  });
});
