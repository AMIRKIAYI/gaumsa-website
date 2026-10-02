const axios = require('axios');

const getBaseUrl = () => {
  return process.env.MPESA_ENVIRONMENT === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke';
};

const getAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  const response = await axios.get(
    `${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` } }
  );

  return response.data.access_token;
};

const getTimestamp = () => {
  const d = new Date();
  return (
    d.getFullYear() +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0') +
    String(d.getHours()).padStart(2, '0') +
    String(d.getMinutes()).padStart(2, '0') +
    String(d.getSeconds()).padStart(2, '0')
  );
};

const getPassword = (shortcode, passkey, timestamp) => {
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
};

const initiateSTKPush = async ({ phone, amount, accountReference, transactionDesc }) => {
  const accessToken = await getAccessToken();
  const timestamp = getTimestamp();
  const shortcode = process.env.MPESA_SHORTCODE;
  const passkey = process.env.MPESA_PASSKEY;
  const password = getPassword(shortcode, passkey, timestamp);

  // Format phone to 2547XXXXXXXX
  let formattedPhone = phone.replace(/\D/g, '');
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '254' + formattedPhone.substring(1);
  } else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) {
    formattedPhone = '254' + formattedPhone;
  }

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline', // ← Sandbox only supports this
    Amount: amount,
    PartyA: formattedPhone,
    PartyB: shortcode,
    PhoneNumber: formattedPhone,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: accountReference,
    TransactionDesc: transactionDesc || 'GAUMSA Payment',
  };

  console.log('📤 STK Push request:', JSON.stringify(payload, null, 2));

  const response = await axios.post(
    `${getBaseUrl()}/mpesa/stkpush/v1/processrequest`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

module.exports = { getAccessToken, initiateSTKPush, getTimestamp, getPassword };