const supabase = require('../config/supabase');

// Verify JWT token from request
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'No token provided' 
      });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid token' 
      });
    }

    // Get user role from database
    const { data: userData } = await supabase
      .from('users')
      .select('role, is_verified, full_name, reg_no, department, year_of_study')
      .eq('id', user.id)
      .single();

    // Check if user is verified (for members)
    if (userData?.role === 'member' && !userData?.is_verified) {
      return res.status(403).json({
        success: false,
        error: 'Account not verified. Please contact registrar.'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      ...userData
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: error.message 
    });
  }
};

module.exports = { verifyToken };