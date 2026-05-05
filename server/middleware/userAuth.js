import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
  let { token } = req.cookies;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.json({ success: false, message: 'No token found. Please login.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id) {
      if (!req.body) req.body = {};
      req.body.userId = decoded.id;
      next();
    } else {
      return res.json({ success: false, message: 'Invalid token structure' });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    console.log('Received Token:', token);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);

    if (error.name === 'TokenExpiredError') {
      return res.json({ success: false, message: 'Token expired. Please login again.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.json({ success: false, message: 'Invalid token. Please login again.' });
    } else {
      return res.json({ success: false, message: 'Token verification failed: ' + error.message });
    }
  }
};

export default userAuth;
