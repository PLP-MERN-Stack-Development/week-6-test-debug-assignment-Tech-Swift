const jwt = require('jsonwebtoken');
const authMiddleware = require('../../src/middleware/authMiddleware');

jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
  let req, res, next;
  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it('should return 401 if no token', () => {
    req.headers['authorization'] = undefined;
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token, authorization denied' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if token is valid', () => {
    req.headers['authorization'] = 'Bearer validtoken';
    jwt.verify.mockReturnValue({ id: 'user1' });
    authMiddleware(req, res, next);
    expect(req.user).toEqual({ id: 'user1' });
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    req.headers['authorization'] = 'Bearer invalidtoken';
    jwt.verify.mockImplementation(() => { throw new Error('bad token'); });
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token is not valid' });
    expect(next).not.toHaveBeenCalled();
  });
});
