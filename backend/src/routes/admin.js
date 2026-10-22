const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');
const { isAdmin, isRegistrar } = require('../middleware/roles');

const DEFAULT_PASSWORD = '123456';
const DEFAULT_NOTIFICATIONS = {
  email: true,
  prayer: true,
  events: true,
  messages: true,
};

const VALID_ROLES = ['member', 'registrar', 'admin'];

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
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Create single user (password defaults to 12345)
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
      role = 'member',
    } = req.body;

    if (!email || !full_name) {
      return res.status(400).json({
        success: false,
        error: 'Email and full name are required',
      });
    }

    const finalRole = VALID_ROLES.includes(role) ? role : 'member';
    if (finalRole !== 'member' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can assign elevated roles',
      });
    }

    const finalPassword =
      typeof password === 'string' && password.trim()
        ? password.trim()
        : DEFAULT_PASSWORD;

    const { data: existing } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'User already exists',
      });
    }

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password: finalPassword,
        email_confirm: true,
        user_metadata: { full_name },
      });

    if (authError) throw authError;
    createdAuthId = authData.user.id;

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
        role: finalRole,
        is_verified: true,
        profile_completed: false,
        must_change_password: true,
        notifications: DEFAULT_NOTIFICATIONS,
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

// Bulk create users
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

        const { data: authData, error: authError } =
          await supabase.auth.admin.createUser({
            email: user.email,
            password: finalPassword,
            email_confirm: true,
            user_metadata: { full_name: user.full_name },
          });

        if (authError) throw authError;
        createdAuthId = authData.user.id;

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

// ✅ Update user profile fields — FIXED
router.patch('/users/:id', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, phone, reg_no, department, year_of_study, role } = req.body;

    console.log('🛠 PATCH /users/:id', { id, body: req.body, actor: req.user?.email });

    // 1. Verify the user exists
    const { data: target, error: getError } = await supabase
      .from('users')
      .select('id, role')
      .eq('id', id)
      .maybeSingle();

    if (getError) throw getError;
    if (!target) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // 2. Role change permission
    if (role !== undefined) {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Only admins can change roles',
        });
      }
      if (!VALID_ROLES.includes(role)) {
        return res.status(400).json({
          success: false,
          error: `Role must be one of: ${VALID_ROLES.join(', ')}`,
        });
      }
    }

    // 3. Build updates — use ISO string for updated_at, NOT Date object
    const updates = {};
    if (full_name !== undefined) updates.full_name = full_name;
    if (phone !== undefined) updates.phone = phone || null;
    if (reg_no !== undefined) updates.reg_no = reg_no || null;
    if (department !== undefined) updates.department = department || null;
    if (year_of_study !== undefined) updates.year_of_study = year_of_study || null;
    if (role !== undefined) updates.role = role;
    updates.updated_at = new Date().toISOString();   // ✅ ISO string

    if (Object.keys(updates).length === 1) {
      return res.status(400).json({ success: false, error: 'No fields to update' });
    }

    console.log('📝 updates:', updates);

    // 4. Perform update — maybeSingle so we don't throw on 0 rows
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    console.log('✅ result:', data, '| error:', error);

    if (error) throw error;
    if (!data) {
      return res.status(500).json({
        success: false,
        error:
          'Update returned 0 rows. This usually means a BEFORE UPDATE trigger is swallowing the row, or a CHECK constraint rejected the change. Check server logs.',
      });
    }

    res.json({ success: true, data, message: 'User updated' });
  } catch (error) {
    console.error('❌ PATCH /users/:id failed:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// Reset password to 12345
router.patch('/users/:id/reset-password', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const finalPassword =
      typeof password === 'string' && password.trim()
        ? password.trim()
        : DEFAULT_PASSWORD;

    const { error } = await supabase.auth.admin.updateUserById(id, {
      password: finalPassword,
    });

    if (error) throw error;

    await supabase
      .from('users')
      .update({ must_change_password: true, updated_at: new Date().toISOString() })
      .eq('id', id);

    res.json({
      success: true,
      message: `Password reset to: ${finalPassword}`,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Quick role change
router.patch('/users/:id/role', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        error: `Role must be one of: ${VALID_ROLES.join(', ')}`,
      });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, data, message: 'Role updated' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ✅ Verify user — FIXED
router.patch('/users/:id/verify', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { id } = req.params;
    const { is_verified } = req.body;

    console.log('🛠 PATCH /users/:id/verify', { id, is_verified });

    const { data, error } = await supabase
      .from('users')
      .update({ is_verified, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();

    console.log('✅ verify result:', data, '| error:', error);

    if (error) throw error;
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'User not found or update returned no rows',
      });
    }

    res.json({
      success: true,
      data,
      message: `User ${is_verified ? 'verified' : 'unverified'}`,
    });
  } catch (error) {
    console.error('❌ verify failed:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// Delete user
router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You cannot delete your own account',
      });
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) throw authError;

    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ==================== REGISTRATION REQUESTS ====================

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

router.post('/registration-requests/:id/approve', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: request, error: getError } = await supabase
      .from('registration_requests')
      .select('*')
      .eq('id', id)
      .maybeSingle();

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

router.patch('/registration-requests/:id/reject', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('registration_requests')
      .update({
        status: 'rejected',
        approved_by: req.user.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

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