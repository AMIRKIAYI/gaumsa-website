import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { 
  CreditCard, CheckCircle, Clock, XCircle, Phone, 
  User, Hash, AlertCircle, Loader2, Smartphone, Shield
} from 'lucide-react';

const RAMADAN_FEE = 1000;

const RamadanPayment: React.FC = () => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    reg_no: '',
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'completed' | 'failed'>('idle');
  const [error, setError] = useState('');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit payment → triggers M-Pesa PIN prompt
  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.initiateRamadanPayment({
        reg_no: formData.reg_no,
        full_name: formData.full_name,
        phone: formData.phone,
      });

      if (res.success) {
        setCheckoutId(res.checkout_request_id);
        setPaymentStatus('pending');
      } else {
        setError(res.error || 'Failed to initiate payment');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Poll for payment status
  useEffect(() => {
    if (!checkoutId || paymentStatus !== 'pending') return;

    const interval = setInterval(async () => {
      const res = await api.checkRamadanPaymentStatus(checkoutId);
      if (res.success) {
        if (res.data.status === 'completed') {
          setPaymentStatus('completed');
          setPaymentDetails(res.data);
          clearInterval(interval);
        } else if (res.data.status === 'failed') {
          setPaymentStatus('failed');
          setError('Payment failed or was cancelled');
          clearInterval(interval);
        }
      }
    }, 3000); // Check every 3 seconds

    // Stop polling after 2 minutes
    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (paymentStatus === 'pending') {
        setError('Payment timeout. Please check your M-Pesa messages.');
        setPaymentStatus('failed');
      }
    }, 120000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [checkoutId, paymentStatus]);

  // ============ SUCCESS SCREEN ============
  if (paymentStatus === 'completed') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
            <CheckCircle className="h-20 w-20 mx-auto mb-4" />
            <h2 className="text-3xl font-bold">Payment Successful!</h2>
            <p className="text-green-100 mt-2">JazakAllah Khair for your contribution</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Registration No:</span>
              <span className="font-mono font-medium">{paymentDetails?.reg_no}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Name:</span>
              <span className="font-medium">{paymentDetails?.full_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Amount Paid:</span>
              <span className="font-bold text-green-600">Ksh {paymentDetails?.amount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">M-Pesa Code:</span>
              <span className="font-mono font-medium">{paymentDetails?.mpesa_code || 'Processing...'}</span>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
              <p className="text-sm text-green-700">
                Your registration for the Ramadan Program is confirmed. We look forward to having you!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ PENDING SCREEN ============
  if (paymentStatus === 'pending') {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-amber-100">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-amber-100 animate-ping"></div>
            <div className="relative w-24 h-24 rounded-full bg-amber-500 flex items-center justify-center">
              <Smartphone className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Check Your Phone
          </h2>
          <p className="text-gray-600 mb-6">
            We've sent a payment request to <strong>{formData.phone}</strong>.
            Enter your M-Pesa PIN to complete the payment.
          </p>

          <div className="bg-amber-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-amber-700">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm font-medium">Waiting for payment confirmation...</span>
            </div>
          </div>

          <div className="space-y-3 text-left text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-gau-msa-primary text-white text-xs flex items-center justify-center">1</span>
              <span>Check your phone for the M-Pesa prompt</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-gau-msa-primary text-white text-xs flex items-center justify-center">2</span>
              <span>Enter your M-Pesa PIN</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-gau-msa-primary text-white text-xs flex items-center justify-center">3</span>
              <span>Wait for confirmation (do not close this page)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ FAILED SCREEN ============
  if (paymentStatus === 'failed') {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center border border-red-100">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Payment Failed</h2>
          <p className="text-gray-600 mb-6">{error || 'The payment could not be completed.'}</p>
          <button
            onClick={() => {
              setPaymentStatus('idle');
              setError('');
              setCheckoutId(null);
            }}
            className="bg-gau-msa-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-gau-msa-secondary transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============ PAYMENT FORM ============
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-gau-msa-gold text-sm font-semibold mb-2">
              <span>🌙</span>
              <span>RAMADAN PROGRAM 2026</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Register for Ramadan Iftar Program</h1>
            <p className="text-gray-200 mt-2">Join our community for Iftar throughout the holy month</p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-sm text-gray-300">Registration Fee</div>
            <div className="text-3xl font-bold text-gau-msa-gold">Ksh {RAMADAN_FEE}</div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Info Side */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gau-msa-primary/10 rounded-lg">
              <Smartphone className="h-5 w-5 text-gau-msa-primary" />
            </div>
            <h3 className="font-bold text-gray-800">How It Works</h3>
          </div>

          <ol className="space-y-4">
            <li className="flex space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gau-msa-primary text-white flex items-center justify-center text-xs font-bold">1</div>
              <div className="text-sm">
                <p className="font-medium text-gray-800">Fill in your details</p>
                <p className="text-gray-500 text-xs mt-0.5">Registration number, full name, and phone</p>
              </div>
            </li>
            <li className="flex space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gau-msa-primary text-white flex items-center justify-center text-xs font-bold">2</div>
              <div className="text-sm">
                <p className="font-medium text-gray-800">Click "Pay Ksh {RAMADAN_FEE}"</p>
                <p className="text-gray-500 text-xs mt-0.5">An M-Pesa prompt will appear on your phone</p>
              </div>
            </li>
            <li className="flex space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gau-msa-primary text-white flex items-center justify-center text-xs font-bold">3</div>
              <div className="text-sm">
                <p className="font-medium text-gray-800">Enter your M-Pesa PIN</p>
                <p className="text-gray-500 text-xs mt-0.5">Complete the payment on your phone</p>
              </div>
            </li>
            <li className="flex space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gau-msa-gold text-white flex items-center justify-center text-xs font-bold">✓</div>
              <div className="text-sm">
                <p className="font-medium text-gray-800">Done!</p>
                <p className="text-gray-500 text-xs mt-0.5">Your registration is confirmed automatically</p>
              </div>
            </li>
          </ol>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-start space-x-2">
            <Shield className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              Secure payment powered by Safaricom M-Pesa. Your PIN is never shared with us.
            </p>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gau-msa-gold/20 rounded-lg">
              <CreditCard className="h-5 w-5 text-gau-msa-primary" />
            </div>
            <h3 className="font-bold text-gray-800">Your Details</h3>
          </div>

          <form onSubmit={handlePay} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Number *
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="reg_no"
                  required
                  value={formData.reg_no}
                  onChange={handleChange}
                  placeholder="GAU-2024-001"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Ahmed Hassan"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                M-Pesa Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0712345678"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent text-sm"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                The M-Pesa PIN prompt will be sent to this number
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Registration Fee</span>
                <span className="font-bold text-gau-msa-primary">Ksh {RAMADAN_FEE.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Sending M-Pesa Prompt...</span>
                </>
              ) : (
                <>
                  <Smartphone className="h-5 w-5" />
                  <span>Pay Ksh {RAMADAN_FEE.toLocaleString()} via M-Pesa</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RamadanPayment;