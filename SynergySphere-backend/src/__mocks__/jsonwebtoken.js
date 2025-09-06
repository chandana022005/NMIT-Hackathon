// Mock jsonwebtoken for testing

const sign = jest.fn(() => 'mock-jwt-token');

const verify = jest.fn((token, secret, callback) => {
  if (token === 'mock-jwt-token') {
    return { id: 'mock-user-id' };
  }
  throw new Error('Invalid token');
});

module.exports = {
  sign,
  verify
};