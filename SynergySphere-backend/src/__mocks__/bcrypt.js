// Mock bcrypt for testing

const hash = jest.fn(() => '$2b$10$abcdefghijklmnopqrstuvwxyz');

const compare = jest.fn((password, hash) => {
  return password === 'password';
});

module.exports = {
  hash,
  compare
};