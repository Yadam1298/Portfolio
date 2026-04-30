import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export const createToken = (email) => {
  return jwt.sign({ email }, SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};
