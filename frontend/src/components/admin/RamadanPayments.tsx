import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import {
  Search, Check, X, Clock, Users, DollarSign,
  Download, Loader2, RefreshCw, TrendingUp,
  Phone, Hash, FileText
} from 'lucide-react';

interface RamadanPayment {
  id: string;
  reg_no: string;
  full_name: string;
  phone: string;
  email: string | null;
  amount: number;
  payment_method: string;
  mpesa_code: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  notes: string | null;
  created_at: string;
  verified_at: string | null;
}

interface Stats {
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  totalAmount: number;
}

const RamadanPayments: React.FC = () => {
  const { token } = useAuth();
  const [payments, setPayments] = useState<RamadanPayment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [statusFilter]);

  const loadData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const [paymentsRes, statsRes] = await Promise.all([
        api.getRamadanPayments(token!, {
          status: statusFilter,
          search: search || undefined,
        }),
        api.getRamadanStats(token!),
      ]);

      if (paymentsRes.success) {
        setPayments(paymentsRes.data || []);
      } else {
        setError(paymentsRes.error || 'Failed to load payments');
      }

      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

 const handleVerify = async (paymentId: string, status: 'completed' | 'failed') => {
  let mpesaCode: string | undefined;

  if (status === 'completed') {
    // ✅ Require M-Pesa code before marking as completed
    mpesaCode = window.prompt(
      '⚠️ Enter the M-Pesa code from the statement\n' +
      '(This is required to verify the payment)\n\n' +
      'Leave empty to cancel:'
    ) || '';

    if (!mpesaCode.trim()) {
      alert('❌ Cancelled — you must enter a valid M-Pesa code');
      return;
    }

    // Basic M-Pesa code format check (10 characters alphanumeric)
    if (mpesaCode.trim().length < 8) {
      const confirm = window.confirm(
        '⚠️ The code looks too short. Are you sure you want to continue?'
      );
      if (!confirm) return;
    }

    const reason = window.confirm(
      `Mark this payment as COMPLETED with M-Pesa code: ${mpesaCode}?\n\n` +
      'This action cannot be undone.'
    );
    if (!reason) return;
  } else {
    const reason = window.prompt(
      'Why are you rejecting this payment? (optional)'
    );
    if (reason === null) return; // user clicked cancel
  }

  const res = await api.verifyRamadanPayment(token!, paymentId, {
    status,
    notes: mpesaCode ? `Manual code: ${mpesaCode}` : undefined,
  });
  
  if (res.success) {
    // Update the mpesa_code separately if provided
    if (mpesaCode) {
      // We need to also update mpesa_code — add this to backend
      await fetch(`${import.meta.env.VITE_API_URL}/ramadan/payments/${paymentId}/set-code`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ mpesa_code: mpesaCode }),
      });
    }
    loadData();
  } else {
    alert('Error: ' + res.error);
  }
};

  const exportCSV = () => {
    if (payments.length === 0) {
      alert('No payments to export');
      return;
    }

    const headers = ['Reg No', 'Name', 'Phone', 'Email', 'Amount', 'M-Pesa Code', 'Status', 'Date'];
    const rows = payments.map((p) => [
      p.reg_no,
      p.full_name,
      p.phone,
      p.email || '',
      p.amount,
      p.mpesa_code || '',
      p.status,
      new Date(p.created_at).toLocaleString(),
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ramadan-payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      failed: 'bg-red-100 text-red-700 border-red-200',
      refunded: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return styles[status] || styles.pending;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-gau-msa-primary mb-3" />
        <p className="text-gray-500 text-sm">Loading Ramadan payments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary rounded-2xl p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-gau-msa-gold text-xs font-semibold mb-2">
              <span>🌙</span>
              <span>RAMADAN PROGRAM</span>
            </div>
            <h2 className="text-2xl font-bold">Payment Management</h2>
            <p className="text-gau-msa-gold mt-1 text-sm">
              Verify and track student contributions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="bg-white/10 hover:bg-white/20 backdrop-blur px-3 py-2 rounded-lg transition flex items-center space-x-2 text-sm"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={exportCSV}
              className="bg-gau-msa-gold text-gau-msa-primary px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center space-x-2 text-sm font-semibold"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
          <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Error loading data</p>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {stats.totalPayments || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total Payments</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Paid</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {stats.completedPayments || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Completed</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Wait</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">
              {stats.pendingPayments || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Pending</p>
          </div>

          <div className="bg-gradient-to-br from-gau-msa-primary to-gau-msa-secondary rounded-2xl shadow-lg p-5 text-white hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-xs text-gau-msa-gold font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold">
              Ksh {(stats.totalAmount || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-200 mt-1">Amount Collected</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-[220px] relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, reg no, phone, or M-Pesa code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadData()}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary text-sm"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <button
            onClick={() => loadData()}
            className="bg-gau-msa-primary text-white px-4 py-2 rounded-lg hover:bg-gau-msa-secondary transition text-sm font-medium"
          >
            Search
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reg No</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">M-Pesa Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No payments found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {search || statusFilter !== 'all'
                        ? 'Try adjusting your filters'
                        : 'Payments will appear here once students start paying'}
                    </p>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-gray-700">{payment.reg_no}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{payment.full_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span>{payment.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">
                      {payment.mpesa_code ? (
                        <span className="text-green-700 font-semibold">{payment.mpesa_code}</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-gau-msa-primary">
                      Ksh {payment.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(payment.created_at).toLocaleDateString()}
                      <br />
                      <span className="text-gray-400">
                        {new Date(payment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {payment.status === 'pending' && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleVerify(payment.id, 'completed')}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Mark as completed"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleVerify(payment.id, 'failed')}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Mark as failed"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      {payment.status === 'completed' && (
                        <span className="text-xs text-green-600 font-medium flex items-center space-x-1">
                          <Check className="h-3 w-3" />
                          <span>Verified</span>
                        </span>
                      )}
                      {payment.status === 'failed' && (
                        <span className="text-xs text-red-500 font-medium">Failed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {payments.length > 0 && (
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Showing {payments.length} payment{payments.length !== 1 ? 's' : ''}</span>
            <span>Auto-refreshes every 30s</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RamadanPayments;