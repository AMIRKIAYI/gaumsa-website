const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');
const { isRegistrar } = require('../middleware/roles');
const { initiateSTKPush } = require('../services/mpesa');

const RAMADAN_FEE = parseInt(process.env.MPESA_AMOUNT) || 1000;

// Initiate STK Push payment
router.post('/payments/initiate', async (req, res) => {
  try {
    const { reg_no, full_name, phone } = req.body;

    console.log('📱 Payment initiate:', { reg_no, full_name, phone });

    if (!reg_no || !full_name || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Registration number, full name, and phone are required',
      });
    }

    // Check if already paid
    const { data: existing } = await supabase
      .from('ramadan_payments')
      .select('id, status')
      .eq('reg_no', reg_no)
      .eq('status', 'completed')
      .maybeSingle();

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'You have already paid for the Ramadan program',
      });
    }

    // Get user ID if logged in
    let userId = null;
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Save pending payment
    const { data: payment, error: insertError } = await supabase
      .from('ramadan_payments')
      .insert({
        user_id: userId,
        reg_no,
        full_name,
        phone,
        amount: RAMADAN_FEE,
        payment_method: 'mpesa',
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) throw insertError;
    console.log('💾 Pending payment saved:', payment.id);

    // Trigger STK Push
    const stkResponse = await initiateSTKPush({
      phone,
      amount: RAMADAN_FEE,
      accountReference: reg_no,
      transactionDesc: `GAUMSA Ramadan - ${full_name}`,
    });

    console.log('✅ STK Push response:', stkResponse);

    // Save checkout IDs
    await supabase
      .from('ramadan_payments')
      .update({
        checkout_request_id: stkResponse.CheckoutRequestID,
        merchant_request_id: stkResponse.MerchantRequestID,
      })
      .eq('id', payment.id);

    res.json({
      success: true,
      message: 'M-Pesa prompt sent to your phone. Enter PIN to complete.',
      payment_id: payment.id,
      checkout_request_id: stkResponse.CheckoutRequestID,
    });
  } catch (error) {
    console.error('❌ STK Push error:', error.response?.data || error.message);
    res.status(400).json({
      success: false,
      error:
        error.response?.data?.errorMessage ||
        error.message ||
        'Failed to initiate payment',
    });
  }
});

// Safaricom callback
router.post('/payments/mpesa/callback', async (req, res) => {
  try {
    console.log('📥 Callback received:', JSON.stringify(req.body, null, 2));

    const { Body } = req.body;
    if (!Body?.stkCallback) {
      return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;

    const { data: payment } = await supabase
      .from('ramadan_payments')
      .select('*')
      .eq('checkout_request_id', CheckoutRequestID)
      .maybeSingle();

    if (!payment) {
      console.error('Payment not found:', CheckoutRequestID);
      return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    if (ResultCode === 0) {
      let mpesaCode = null;
      if (CallbackMetadata?.Item) {
        const receipt = CallbackMetadata.Item.find((i) => i.Name === 'MpesaReceiptNumber');
        mpesaCode = receipt?.Value || null;
      }

      await supabase
        .from('ramadan_payments')
        .update({ status: 'completed', mpesa_code: mpesaCode, updated_at: new Date() })
        .eq('id', payment.id);

      console.log('✅ Payment completed:', mpesaCode);
    } else {
      await supabase
        .from('ramadan_payments')
        .update({ status: 'failed', notes: ResultDesc, updated_at: new Date() })
        .eq('id', payment.id);

      console.log('❌ Payment failed:', ResultDesc);
    }

    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    console.error('Callback error:', error);
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }
});

// Check payment status
router.get('/payments/status/:checkoutId', async (req, res) => {
  try {
    const { checkoutId } = req.params;
    const { data: payment } = await supabase
      .from('ramadan_payments')
      .select('id, status, mpesa_code, full_name, reg_no, amount')
      .eq('checkout_request_id', checkoutId)
      .maybeSingle();

    if (!payment) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// My payments
router.get('/payments/me', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ramadan_payments')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Admin: get all
router.get('/payments', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = supabase.from('ramadan_payments').select('*');
    if (status && status !== 'all') query = query.eq('status', status);
    if (search) {
      query = query.or(`full_name.ilike.%${search}%,reg_no.ilike.%${search}%,phone.ilike.%${search}%,mpesa_code.ilike.%${search}%`);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Admin: stats
router.get('/payments/stats', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { count: total } = await supabase.from('ramadan_payments').select('*', { count: 'exact', head: true });
    const { count: completed } = await supabase.from('ramadan_payments').select('*', { count: 'exact', head: true }).eq('status', 'completed');
    const { count: pending } = await supabase.from('ramadan_payments').select('*', { count: 'exact', head: true }).eq('status', 'pending');
    const { data: amounts } = await supabase.from('ramadan_payments').select('amount').eq('status', 'completed');
    const totalAmount = amounts?.reduce((s, p) => s + (p.amount || 0), 0) || 0;

    res.json({
      success: true,
      data: { totalPayments: total, completedPayments: completed, pendingPayments: pending, totalAmount },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Admin: set M-Pesa code manually
router.patch('/payments/:id/set-code', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { id } = req.params;
    const { mpesa_code } = req.body;

    if (!mpesa_code) {
      return res.status(400).json({
        success: false,
        error: 'M-Pesa code is required'
      });
    }

    const { data, error } = await supabase
      .from('ramadan_payments')
      .update({
        mpesa_code: mpesa_code.toUpperCase(),
        status: 'completed',
        notes: `Manual code entered by admin: ${mpesa_code}`,
        verified_by: req.user.id,
        verified_at: new Date(),
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Admin: verify manually
router.patch('/payments/:id/verify', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const { data, error } = await supabase
      .from('ramadan_payments')
      .update({ status, notes, verified_by: req.user.id, verified_at: new Date(), updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;