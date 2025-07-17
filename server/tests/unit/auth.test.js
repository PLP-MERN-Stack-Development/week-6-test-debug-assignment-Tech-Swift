require('dotenv/config');
const { hashPassword, comparePassword, generateToken, verifyToken } = require('../../src/utils/auth');

describe('auth utils', () => {
  it('hashes and compares password', async () => {
    const pw = 'testpass';
    const hash = await hashPassword(pw);
    expect(await comparePassword(pw, hash)).toBe(true);
    expect(await comparePassword('wrong', hash)).toBe(false);
  });

  it('generates and verifies JWT token', () => {
    const token = generateToken({ id: 'user1' });
    const payload = verifyToken(token);
    expect(payload.id).toBe('user1');
  });
});
