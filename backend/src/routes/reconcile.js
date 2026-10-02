const express = require('express');
const router = express.Router();
const axios = require('axios');
const supabase = require('../config/supabase');
const { verifyToken } = require('../middleware/auth');
const { isRegistrar } = require('../middleware/roles');
const { getAccessToken, getTimestamp, getPassword } = require('../services/mpesa');

const getBaseUrl = () => {
  return process.env.MPESA_ENVIRONMENT === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';
};

// Query Safaricom for STK status
const querySTKStatus = async (checkoutRequestId) => {
  const accessToken = await getAccessToken();
  const timestamp = getTimestamp();
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const password = getPassword(shortcode, passkey, timestamp);

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId,
  };

  try {
    const response = await axios.post(
      `${getBaseUrl()}/mpesa/stkpushquery/v1/query`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message 
    };
  }
};

// Reconcile all pending payments (Admin only)
router.post('/pending', verifyToken, isRegistrar, async (req, res) => {
  try {
    // Get all pending payments with a checkout_request_id
    const { data: pendingPayments, error } = await supabase
      .from('ramadan_payments')
      .select('*')
      .eq('status', 'pending')
      .not('checkout_request_id', 'is', null);

    if (error) throw error;

    const results = {
      checked: 0,
      completed: 0,
      failed: 0,
      stillPending: 0,
      errors: [],
    };

    for (const payment of pendingPayments) {
      results.checked++;
      
      const queryResult = await querySTKStatus(payment.checkout_request_id);
      
      if (!queryResult.success) {
        results.errors.push({
          reg_no: payment.reg_no,
          error: queryResult.error?.errorMessage || 'Query failed',
        });
        continue;
      }

      const data = queryResult.data;
      console.log(`Payment ${payment.reg_no}:`, data);

      // ResultCode 0 = success, 1032 = cancelled, 1037 = timeout, 2001 = wrong PIN
      if (data.ResultCode === '0' || data.ResultCode === 0) {
        // Success — mark completed
        await supabase
          .from('ramadan_payments')
          .update({
            status: 'completed',
            mpesa_code: data.MpesaReceiptNumber || 'RECONCILED',
            notes: 'Reconciled manually',
            updated_at: new Date(),
          })
          .eq('id', payment.id);
        results.completed++;
      } else if (data.ResultCode === '1032' || data.ResultCode === '1037' || 
                 data.ResultCode === '2001' || data.ResultCode === '1') {
        // Failed — mark failed
        await supabase
          .from('ramadan_payments')
          .update({
            status: 'failed',
            notes: data.ResultDesc || 'Failed per Safaricom query',
            updated_at: new Date(),
          })
          .eq('id', payment.id);
        results.failed++;
      } else {
        // Still processing
        results.stillPending++;
      }
    }

    res.json({
      success: true,
      message: `Reconciled ${results.checked} payments`,
      results,
    });
  } catch (error) {
    console.error('Reconcile error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// Reconcile a single payment (Admin only)
router.post('/single/:id', verifyToken, isRegistrar, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: payment, error } = await supabase
      .from('ramadan_payments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!payment?.checkout_request_id) {
      return res.status(400).json({
        success: false,
        error: 'No checkout request ID for this payment',
      });
    }

    const queryResult = await querySTKStatus(payment.checkout_request_id);
    if (!queryResult.success) {
      return res.status(400).json({ success: false, error: queryResult.error });
    }

    const data = queryResult.data;

    if (data.ResultCode === '0' || data.ResultCode === 0) {
      const { data: updated } = await supabase
        .from('ramadan_payments')
        .update({
          status: 'completed',
          mpesa_code: data.MpesaReceiptNumber || 'RECONCILED',
          notes: 'Reconciled manually',
          updated_at: new Date(),
        })
        .eq('id', id)
        .select()
        .single();
      return res.json({ success: true, data: updated });
    } else {
      const { data: updated } = await supabase
        .from('ramadan_payments')
        .update({
          status: 'failed',
          notes: data.ResultDesc || 'Failed per Safaricom query',
          updated_at: new Date(),
        })
        .eq('id', id)
        .select()
        .single();
      return res.json({ success: true, data: updated });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;