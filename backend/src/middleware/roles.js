// Check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      error: 'Admin access required' 
    });
  }
  next();
};

// Check if user is admin or registrar
const isRegistrar = (req, res, next) => {
  if (!req.user || !['admin', 'registrar'].includes(req.user.role)) {
    return res.status(403).json({ 
      success: false, 
      error: 'Registrar access required' 
    });
  }
  next();
};

module.exports = { isAdmin, isRegistrar };