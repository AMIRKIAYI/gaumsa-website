const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get all leaders
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leaders')
      .select('*')
      .order('order');

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;