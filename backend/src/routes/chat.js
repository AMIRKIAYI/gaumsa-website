const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');

// Get chat messages
router.get('/', verifyToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    res.json({ success: true, data: data.reverse() });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Send chat message
router.post('/', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required'
      });
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: req.user.id,
        username: req.user.full_name || req.user.email,
        content
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;