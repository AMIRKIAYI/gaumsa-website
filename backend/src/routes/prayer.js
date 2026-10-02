const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get prayer times
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    let query = supabase.from('prayer_times').select('*');

    if (date) {
      query = query.eq('date', date);
    } else {
      query = query.order('date', { ascending: false }).limit(1);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.json({ success: true, data: data[0] || null });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;