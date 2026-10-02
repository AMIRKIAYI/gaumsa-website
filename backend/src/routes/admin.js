const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');
const { isAdmin, isRegistrar } = require('../middleware/roles');

// ==================== USERS MANAGEMENT ====================

// Get all users
router.get('/users', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { search, role, verified, department } = req.query;
    let query = supabase.from('users').select('*');

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,reg_no.ilike.%${search}%,email.ilike.%${search}%`
      );
    }
    if (role && role !== 'all') {
      query = query.eq('role', role);
    }
    if (verified === 'true') {
      query = query.eq('is_verified', true);
    }
    if (verified === 'false') {
      query = query.eq('is_verified', false);
    }
    if (department && department !== 'all') {
      query = query.eq('department', department);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get single user
router.get('/users/:id', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Create single user
router.post('/users', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { reg_no, full_name, phone, email, department, year_of_study } = req.body;

    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: 'GAUMSA1234',
      email_confirm: true,
      user_metadata: { full_name }
    });

    if (authError) throw authError;

    // Create user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        reg_no,
        full_name,
        phone,
        email,
        department,
        year_of_study: year_of_study || '1st Year',
        role: 'member',
        is_verified: true,
        created_by: req.user.id
      })
      .select()
      .single();

    if (userError) throw userError;

    res.json({
      success: true,
      data: userData,
      message: 'User registered successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Bulk create users
router.post('/users/bulk', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { users } = req.body;
    const results = [];
    const errors = [];

    for (const user of users) {
      try {
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: 'GAUMSA1234',
          email_confirm: true,
          user_metadata: { full_name: user.full_name }
        });

        if (authError) throw authError;

        // Create user profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            reg_no: user.reg_no,
            full_name: user.full_name,
            phone: user.phone,
            email: user.email,
            department: user.department,
            year_of_study: user.year_of_study || '1st Year',
            role: 'member',
            is_verified: true,
            created_by: req.user.id
          })
          .select()
          .single();

        if (userError) throw userError;
        results.push(userData);
      } catch (error) {
        errors.push({ email: user.email, error: error.message });
      }
    }

    res.json({
      success: true,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
      message: `${results.length} users registered successfully`
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Verify user
router.patch('/users/:id/verify', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_verified } = req.body;

    const { data, error } = await supabase
      .from('users')
      .update({ is_verified, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data,
      message: `User ${is_verified ? 'verified' : 'unverified'}`
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete user
router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Delete from auth
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) throw authError;

    // Delete from users table
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ==================== REGISTRATION REQUESTS ====================

// Get registration requests
router.get('/registration-requests', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = supabase.from('registration_requests').select('*');

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,reg_no.ilike.%${search}%,email.ilike.%${search}%`
      );
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Create registration request
router.post('/registration-requests', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { reg_no, full_name, phone, email, department, year_of_study } = req.body;

    const { data, error } = await supabase
      .from('registration_requests')
      .insert({
        reg_no,
        full_name,
        phone,
        email,
        department,
        year_of_study: year_of_study || '1st Year',
        requested_by: req.user.id,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Bulk registration requests
router.post('/registration-requests/bulk', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { requests } = req.body;
    const results = [];
    const errors = [];

    for (const req of requests) {
      try {
        const { data, error } = await supabase
          .from('registration_requests')
          .insert({
            reg_no: req.reg_no,
            full_name: req.full_name,
            phone: req.phone,
            email: req.email,
            department: req.department,
            year_of_study: req.year_of_study || '1st Year',
            requested_by: req.user?.id || null,
            status: 'pending'
          })
          .select()
          .single();

        if (error) throw error;
        results.push(data);
      } catch (error) {
        errors.push({ reg_no: req.reg_no, error: error.message });
      }
    }

    res.json({
      success: true,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
      message: `${results.length} requests created successfully`
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Approve registration request
router.post('/registration-requests/:id/approve', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { id } = req.params;

    // Get the request
    const { data: request, error: getError } = await supabase
      .from('registration_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (getError) throw getError;
    if (!request) throw new Error('Request not found');

    // Call the approve function
    const { data, error } = await supabase.rpc('approve_registration', {
      request_id: id,
      approver_id: req.user.id
    });

    if (error) throw error;

    res.json({
      success: true,
      data: { user_id: data },
      message: 'Registration approved successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Reject registration request
router.patch('/registration-requests/:id/reject', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('registration_requests')
      .update({
        status: 'rejected',
        approved_by: req.user.id,
        approved_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data, message: 'Registration rejected' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ==================== STATISTICS ====================

router.get('/stats', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: verifiedUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_verified', true);

    const { count: adminUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');

    const { count: pendingRequests } = await supabase
      .from('registration_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { count: totalActivities } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true });

    res.json({
      success: true,
      data: {
        totalUsers,
        verifiedUsers,
        adminUsers,
        pendingRequests,
        totalActivities
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;