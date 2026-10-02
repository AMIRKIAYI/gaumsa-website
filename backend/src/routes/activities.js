const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');

// Get all activities
router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = supabase.from('activities').select('*');

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('date', { ascending: true });
    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get single activity
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Create activity
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const { title, category, description, date, time, location, coordinator, max_participants } = req.body;

    const { data, error } = await supabase
      .from('activities')
      .insert({
        title,
        category,
        description,
        date,
        time,
        location,
        coordinator,
        max_participants: max_participants || 0,
        status: 'upcoming',
        created_by: req.user.id
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Register for activity
router.post('/:id/register', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Check if already registered
    const { data: existing, error: checkError } = await supabase
      .from('activity_registrations')
      .select('*')
      .eq('activity_id', id)
      .eq('user_id', user_id);

    if (existing && existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Already registered for this activity'
      });
    }

    // Register
    const { error: regError } = await supabase
      .from('activity_registrations')
      .insert({ activity_id: id, user_id });

    if (regError) throw regError;

    // Update participant count
    const { error: updateError } = await supabase.rpc('increment_participants', {
      activity_id: id
    });

    if (updateError) throw updateError;

    res.json({ success: true, message: 'Registered successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;