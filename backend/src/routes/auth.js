const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');

// ==================== SIGN UP ====================
router.post('/signup', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and full name are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists. Please contact registrar.',
      });
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: full_name, email: email },
      },
    });

    if (authError) {
      console.error('Auth error:', authError);
      return res.status(400).json({
        success: false,
        error: authError.message || 'Failed to create account',
      });
    }

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          full_name: full_name,
          email: email,
          role: 'member',
          is_verified: true,
          profile_completed: false,
          must_change_password: false,   // ✅ self-signup chose their own password
        });

      if (profileError) {
        console.error('Profile error:', profileError);
        await supabase.auth.admin.deleteUser(authData.user.id);
        return res.status(400).json({
          success: false,
          error: 'Failed to create user profile. Please try again.',
        });
      }
    }

    res.json({
      success: true,
      message: 'Account created successfully!',
      user: authData.user,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Registration failed',
    });
  }
});

// ==================== SIGN IN ====================
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message || 'Invalid credentials',
      });
    }

    console.log('🔍 Auth user ID:', data.user.id);
    console.log('🔍 Auth user email:', data.user.email);

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(
        'id, full_name, email, role, is_verified, reg_no, department, year_of_study, phone, profile_completed, must_change_password, notifications, created_at'
      )
      .eq('id', data.user.id)
      .maybeSingle();

    console.log('🔍 Profile lookup result:', userData);
    console.log('🔍 Profile lookup error:', userError);

    if (userError) {
      console.error('❌ User profile fetch error:', userError);
    }

    let finalUserData = userData;
    if (!userData) {
      console.log('⚠️ No profile found, creating one...');
      const { data: newProfile } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          full_name: data.user.user_metadata?.full_name || 'User',
          email: data.user.email,
          role: 'member',
          is_verified: true,
          profile_completed: false,
          must_change_password: false,
        })
        .select()
        .maybeSingle();
      finalUserData = newProfile;
    }

    if (finalUserData?.role === 'member' && !finalUserData?.is_verified) {
      return res.status(403).json({
        success: false,
        error: 'Account not verified. Please contact registrar.',
      });
    }

    const cleanUser = {
      id: data.user.id,
      email: data.user.email,
      full_name: finalUserData?.full_name || 'User',
      role: finalUserData?.role || 'member',
      is_verified: finalUserData?.is_verified || false,
      reg_no: finalUserData?.reg_no || null,
      department: finalUserData?.department || null,
      year_of_study: finalUserData?.year_of_study || null,
      phone: finalUserData?.phone || null,
      profile_completed: finalUserData?.profile_completed || false,
      must_change_password: finalUserData?.must_change_password || false, // ✅
      notifications: finalUserData?.notifications || null,                // ✅
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        finalUserData?.full_name || 'User'
      )}&background=1a472a&color=fff&size=128`,
    };

    console.log(
      '✅ Signed in:',
      cleanUser.email,
      '| Role:',
      cleanUser.role,
      '| Profile completed:',
      cleanUser.profile_completed,
      '| Must change password:',
      cleanUser.must_change_password
    );

    res.json({
      success: true,
      user: cleanUser,
      session: data.session,
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Login failed',
    });
  }
});

// ==================== GET CURRENT USER ====================
router.get('/me', verifyToken, async (req, res) => {
  try {
    const { data: userData } = await supabase
      .from('users')
      .select(
        'id, full_name, email, role, is_verified, reg_no, department, year_of_study, phone, profile_completed, must_change_password, notifications, created_at'
      )
      .eq('id', req.user.id)
      .maybeSingle();

    const cleanUser = {
      id: req.user.id,
      email: req.user.email,
      full_name: userData?.full_name || 'User',
      role: userData?.role || 'member',
      is_verified: userData?.is_verified || false,
      reg_no: userData?.reg_no || null,
      department: userData?.department || null,
      year_of_study: userData?.year_of_study || null,
      phone: userData?.phone || null,
      profile_completed: userData?.profile_completed || false,
      must_change_password: userData?.must_change_password || false, // ✅
      notifications: userData?.notifications || null,                // ✅
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userData?.full_name || 'User'
      )}&background=1a472a&color=fff&size=128`,
    };

    res.json({
      success: true,
      user: cleanUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ==================== UPDATE PROFILE (Profile Completion) ====================
router.put('/update-profile', verifyToken, async (req, res) => {
  try {
    const { reg_no, department, year_of_study, phone } = req.body;
    const userId = req.user.id;

    if (!reg_no || !department || !year_of_study) {
      return res.status(400).json({
        success: false,
        error: 'Registration number, department, and year of study are required',
      });
    }

    // Check if reg_no is already taken
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('reg_no', reg_no)
      .neq('id', userId)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'This registration number is already in use by another member',
      });
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        reg_no,
        department,
        year_of_study,
        phone: phone || null,
        profile_completed: true,
        updated_at: new Date().toISOString(),   // ✅ ISO string
      })
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        error: 'Profile update returned 0 rows — check triggers or constraints',
      });
    }

    console.log('✅ Profile completed for user:', updatedUser.email);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update profile',
    });
  }
});

// ==================== ✅ UPDATE PASSWORD ====================
router.patch('/update-password', verifyToken, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    if (newPassword === '123456') {
      return res.status(400).json({
        success: false,
        error: 'Please choose a password other than the default',
      });
    }

    // Update the auth password using the service role
    const { error: authError } = await supabase.auth.admin.updateUserById(
      req.user.id,
      { password: newPassword }
    );

    if (authError) throw authError;

    // Clear the must_change_password flag
    const { data, error } = await supabase
      .from('users')
      .update({
        must_change_password: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.user.id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(500).json({
        success: false,
        error: 'Password updated, but profile flag could not be cleared',
      });
    }

    console.log('✅ Password updated for:', req.user.email);

    res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update password',
    });
  }
});

module.exports = router;