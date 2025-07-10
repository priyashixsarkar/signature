const roleCheck = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      return next();
    }
    return res.status(403).json({ error: 'Access denied: insufficient permissions' });
  };
};

module.exports = roleCheck;
