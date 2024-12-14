const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('Received token:', token); // Debug log

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        console.log('JWT_SECRET:', process.env.JWT_SECRET); // Debug log
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Debug log
        req.user = decoded;
        next();
    } catch (err) {
        console.log('Token verification error:', err); // Debug log
        res.status(401).json({ msg: 'Token is not valid' });
    }
}; 