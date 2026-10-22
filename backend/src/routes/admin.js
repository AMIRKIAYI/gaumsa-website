const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');
const { isAdmin, isRegistrar } = require('../middleware/roles');

// ✅ Default values for newly created users
const DEFAULT_PASSWORD = '12345';
const DEFAULT_NOTIFICATIONS = {
  email: true,
  prayer: true,
  events: true,
  messages: true,
};

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

// ✅ Create single user (password defaults to 12345)
router.post('/users', verifyToken, isRegistrar, async (req, res) => {
  let createdAuthId = null;

  try {
    const {
      reg_no,
      full_name,
      phone,
      email,
      department,
      year_of_study,
      password,
    } = req.body;

    if (!email || !full_name) {
      return res.status(400).json({
        success: false,
        error: 'Email and full name are required',
      });
    }

    // ✅ Use provided password or default to 12345
    const finalPassword =
      typeof password === 'string' && password.trim()
        ? password.trim()
        : DEFAULT_PASSWORD;

    // Check if user exists in public.users
    const { data: existing } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'User already exists',
      });
    }

    // Create auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password: finalPassword,
        email_confirm: true,
        user_metadata: { full_name },
      });

    if (authError) throw authError;
    createdAuthId = authData.user.id;

    // Create user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        reg_no: reg_no || null,
        full_name,
        phone: phone || null,
        email,
        department: department || null,
        year_of_study: year_of_study || '1st Year',
        role: 'member',
        is_verified: true,
        profile_completed: false,      // ✅ forces profile completion
        must_change_password: true,    // ✅ see note below
        notifications: DEFAULT_NOTIFICATIONS, // ✅ default prefs
        created_by: req.user.id,
      })
      .select()
      .single();

    if (userError) throw userError;

    res.json({
      success: true,
      data: userData,
      message: `User created successfully. Default password: ${finalPassword}`,
    });
  } catch (error) {
    // ✅ Cleanup: if auth was created but profile failed, delete the auth user
    if (createdAuthId) {
      try {
        await supabase.auth.admin.deleteUser(createdAuthId);
      } catch (cleanupErr) {
        console.error('Cleanup failed for auth user', createdAuthId, cleanupErr);
      }
    }
    res.status(400).json({ success: false, error: error.message });
  }
});

// ✅ Bulk create users (password defaults to 12345)
router.post('/users/bulk', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { users } = req.body;
    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No users provided',
      });
    }

    const results = [];
    const errors = [];

    for (const user of users) {
      let createdAuthId = null;
      try {
        if (!user.email || !user.full_name) {
          throw new Error('Email and full name are required');
        }

        const finalPassword =
          typeof user.password === 'string' && user.password.trim()
            ? user.password.trim()
            : DEFAULT_PASSWORD;

        // Create auth user
        const { data: authData, error: authError } =
          await supabase.auth.admin.createUser({
            email: user.email,
            password: finalPassword,
            email_confirm: true,
            user_metadata: { full_name: user.full_name },
          });

        if (authError) throw authError;
        createdAuthId = authData.user.id;

        // Create user profile
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            reg_no: user.reg_no || null,
            full_name: user.full_name,
            phone: user.phone || null,
            email: user.email,
            department: user.department || null,
            year_of_study: user.year_of_study || '1st Year',
            role: 'member',
            is_verified: true,
            profile_completed: false,
            must_change_password: true,
            notifications: DEFAULT_NOTIFICATIONS,
            created_by: req.user.id,
          })
          .select()
          .single();

        if (userError) throw userError;
        results.push(userData);
      } catch (error) {
        // Cleanup orphaned auth user
        if (createdAuthId) {
          try {
            await supabase.auth.admin.deleteUser(createdAuthId);
          } catch (cleanupErr) {
            console.error('Cleanup failed for', createdAuthId, cleanupErr);
          }
        }
        errors.push({ email: user.email, error: error.message });
      }
    }

    res.json({
      success: true,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
      message: `${results.length} users registered successfully. Default password: ${DEFAULT_PASSWORD}`,
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
      message: `User ${is_verified ? 'verified' : 'unverified'}`,
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
    const { error } = await supabase.from('users').delete().eq('id', id);
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
        status: 'pending',
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

    for (const r of requests) {
      try {
        const { data, error } = await supabase
          .from('registration_requests')
          .insert({
            reg_no: r.reg_no,
            full_name: r.full_name,
            phone: r.phone,
            email: r.email,
            department: r.department,
            year_of_study: r.year_of_study || '1st Year',
            requested_by: req.user.id,
            status: 'pending',
          })
          .select()
          .single();

        if (error) throw error;
        results.push(data);
      } catch (error) {
        errors.push({ reg_no: r.reg_no, error: error.message });
      }
    }

    res.json({
      success: true,
      data: results,
      errors: errors.length > 0 ? errors : undefined,
      message: `${results.length} requests created successfully`,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Approve registration request
router.post('/registration-requests/:id/approve', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: request, error: getError } = await supabase
      .from('registration_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (getError) throw getError;
    if (!request) throw new Error('Request not found');

    const { data, error } = await supabase.rpc('approve_registration', {
      request_id: id,
      approver_id: req.user.id,
    });

    if (error) throw error;

    res.json({
      success: true,
      data: { user_id: data },
      message: 'Registration approved successfully',
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
        approved_at: new Date(),
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
        totalActivities,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;