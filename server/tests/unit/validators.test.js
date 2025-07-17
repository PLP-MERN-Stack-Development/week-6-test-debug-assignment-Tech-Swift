require('dotenv/config');
const { validateEmail } = require('../../src/utils/validators');

describe('validators utils', () => {
  it('validates correct email', () => {
    expect(validateEmail('test@email.com')).toBe(true);
    expect(validateEmail('bad-email')).toBe(false);
  });
});
