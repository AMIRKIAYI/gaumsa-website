import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import {
  Users, UserPlus, Upload, Search,
  Check, X, Clock, Download, Trash2, Edit,
  FileSpreadsheet, AlertCircle, ChevronRight,
  UserCheck, UserX, Mail, Phone, BookOpen,
  Shield, TrendingUp, Loader2, PlusCircle,
  CheckCircle, XCircle, Pencil, Eye,
} from 'lucide-react';

// ==================== TYPES ====================

interface User {
  id: string;
  reg_no: string;
  full_name: string;
  phone: string;
  email: string;
  department: string;
  year_of_study: string;
  role: string;
  is_verified: boolean;
  created_at: string;
}

interface RegistrationRequest {
  id: string;
  reg_no: string;
  full_name: string;
  phone: string;
  email: string;
  department: string;
  year_of_study: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

type Toast = { id: string; type: 'success' | 'error' | 'info'; message: string };
type ConfirmDialog = {
  title: string;
  message: string;
  confirmLabel?: string;
  tone?: 'danger' | 'primary';
  onConfirm: () => void | Promise<void>;
};

const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Business Administration',
  'Education',
  'Islamic Studies',
  'Economics',
  'Finance and Accounting',
  'Communication Studies',
  'Journalism and Media',
  'Graphic Design',
  'Event Management',
  'Project Management',
  'Islamic Law',
  'Islamic Theology',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate Student'];
const ROLES = [
  { value: 'member', label: 'Member' },
  { value: 'registrar', label: 'Registrar' },
  { value: 'admin', label: 'Admin' },
];

const EMPTY_FORM = {
  reg_no: '',
  full_name: '',
  phone: '',
  email: '',
  department: '',
  year_of_study: '1st Year',
  role: 'member',
};

// ==================== MAIN COMPONENT ====================

const RegistrarDashboard: React.FC = () => {
  const { token, user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';

  const [activeTab, setActiveTab] = useState<'members' | 'requests' | 'add'>('members');
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterVerified, setFilterVerified] = useState('all');

  // Add Member
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  // Edit Member
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ ...EMPTY_FORM });

  // Bulk
  const [bulkData, setBulkData] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Toasts + confirms
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog | null>(null);

  // ==================== HELPERS ====================

  const toast = useCallback((type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const confirm = (opts: ConfirmDialog) => setConfirmDialog(opts);

  // ==================== DEBOUNCE SEARCH ====================

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // ==================== LOAD DATA ====================

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'members') {
        const res = await api.getUsers(token!, {
          search: debouncedSearch,
          role: filterRole,
          verified: filterVerified,
        });
        if (res.success) setUsers(res.data);
        else toast('error', res.error || 'Failed to load members');
      } else if (activeTab === 'requests') {
        const res = await api.getRegistrationRequests(token!, { status: 'pending' });
        if (res.success) setRequests(res.data);
        else toast('error', res.error || 'Failed to load requests');
      }
    } catch (err: any) {
      toast('error', err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, debouncedSearch, filterRole, filterVerified, token, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ==================== STATS ====================

  const stats = useMemo(() => {
    const total = users.length;
    const verified = users.filter((u) => u.is_verified).length;
    const unverified = total - verified;
    const admins = users.filter((u) => u.role === 'admin').length;
    return { total, verified, unverified, admins };
  }, [users]);

  // ==================== ADD MEMBER ====================

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('add');
    try {
      const res = await api.createUser(token!, formData);
      if (res.success) {
        toast('success', `${formData.full_name} added. Default password: 12345`);
        setFormData({ ...EMPTY_FORM });
        setActiveTab('members');
        loadData();
      } else {
        toast('error', res.error || 'Failed to add member');
      }
    } catch (err: any) {
      toast('error', err.message || 'Something went wrong');
    } finally {
      setActionLoading(null);
    }
  };

  // ==================== EDIT ====================

  const openEdit = (u: User) => {
    setEditingUser(u);
    setEditForm({
      reg_no: u.reg_no || '',
      full_name: u.full_name || '',
      phone: u.phone || '',
      email: u.email || '',
      department: u.department || '',
      year_of_study: u.year_of_study || '1st Year',
      role: u.role || 'member',
    });
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setActionLoading(`edit-${editingUser.id}`);
    try {
      // Reuse create-style endpoint — replace with api.updateUser if you have it
      const res = await fetch(
        `${(import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api'}/admin/users/${editingUser.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            full_name: editForm.full_name,
            phone: editForm.phone,
            reg_no: editForm.reg_no,
            department: editForm.department,
            year_of_study: editForm.year_of_study,
            role: editForm.role,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast('success', 'Member updated');
        setEditingUser(null);
        loadData();
      } else {
        toast('error', data.error || 'Update failed');
      }
    } catch (err: any) {
      toast('error', err.message || 'Update failed');
    } finally {
      setActionLoading(null);
    }
  };

  // ==================== VERIFY ====================

  const handleVerifyUser = (userId: string, verified: boolean) => {
    confirm({
      title: verified ? 'Verify member?' : 'Unverify member?',
      message: verified
        ? 'The member will be able to access all features.'
        : 'The member will lose access until re-verified.',
      confirmLabel: verified ? 'Verify' : 'Unverify',
      tone: verified ? 'primary' : 'danger',
      onConfirm: async () => {
        setActionLoading(`verify-${userId}`);
        const res = await api.verifyUser(token!, userId, verified);
        if (res.success) {
          toast('success', verified ? 'Member verified' : 'Member unverified');
          loadData();
        } else {
          toast('error', res.error || 'Failed');
        }
        setActionLoading(null);
      },
    });
  };

  // ==================== DELETE ====================

  const handleDeleteUser = (u: User) => {
    confirm({
      title: 'Delete member?',
      message: `Delete ${u.full_name} permanently? This cannot be undone.`,
      confirmLabel: 'Delete',
      tone: 'danger',
      onConfirm: async () => {
        setActionLoading(`delete-${u.id}`);
        try {
          const res = await fetch(
            `${(import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api'}/admin/users/${u.id}`,
            {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = await res.json();
          if (data.success) {
            toast('success', `${u.full_name} deleted`);
            loadData();
          } else {
            toast('error', data.error || 'Delete failed');
          }
        } catch (err: any) {
          toast('error', err.message || 'Delete failed');
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  // ==================== REQUESTS ====================

  const handleApproveRequest = (requestId: string) => {
    confirm({
      title: 'Approve registration?',
      message: 'A user account will be created with default password 12345.',
      confirmLabel: 'Approve',
      tone: 'primary',
      onConfirm: async () => {
        setActionLoading(`approve-${requestId}`);
        const res = await api.approveRegistration(token!, requestId);
        if (res.success) {
          toast('success', 'Registration approved');
          loadData();
        } else {
          toast('error', res.error || 'Failed');
        }
        setActionLoading(null);
      },
    });
  };

  const handleRejectRequest = (requestId: string) => {
    confirm({
      title: 'Reject registration?',
      message: 'The request will be marked as rejected.',
      confirmLabel: 'Reject',
      tone: 'danger',
      onConfirm: async () => {
        setActionLoading(`reject-${requestId}`);
        const res = await api.rejectRegistration(token!, requestId);
        if (res.success) {
          toast('success', 'Registration rejected');
          loadData();
        } else {
          toast('error', res.error || 'Failed');
        }
        setActionLoading(null);
      },
    });
  };

  // ==================== BULK ====================

  const handleBulkRegister = async () => {
    try {
      const lines = bulkData.split('\n').filter((l) => l.trim());
      const parsed = lines.map((line) => {
        const [reg_no, full_name, phone, email, department, year] = line
          .split(',')
          .map((s) => s.trim());
        return { reg_no, full_name, phone, email, department, year_of_study: year || '1st Year' };
      });

      if (!parsed.length) return toast('error', 'No valid rows');

      setBulkLoading(true);
      const res = await api.bulkCreateUsers(token!, parsed);
      setBulkLoading(false);

      if (res.success) {
        const okCount = res.data?.length ?? 0;
        const errCount = res.errors?.length ?? 0;
        toast(
          errCount ? 'info' : 'success',
          `${okCount} created${errCount ? `, ${errCount} failed` : ''}. Password: 12345`
        );
        setBulkData('');
        setShowBulkModal(false);
        loadData();
      } else {
        toast('error', res.error || 'Bulk upload failed');
      }
    } catch (err: any) {
      setBulkLoading(false);
      toast('error', err.message || 'Failed to parse data');
    }
  };

  // ==================== CSV EXPORT ====================

  const exportCSV = () => {
    const headers = ['Reg No', 'Full Name', 'Phone', 'Email', 'Department', 'Year', 'Role', 'Verified'];
    const rows = users.map((u) => [
      u.reg_no || '',
      u.full_name || '',
      u.phone || '',
      u.email || '',
      u.department || '',
      u.year_of_study || '',
      u.role || '',
      u.is_verified ? 'Yes' : 'No',
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gaumsa-members-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast('success', 'CSV downloaded');
  };

  // ==================== RENDER ====================

  return (
    <div className="space-y-4 md:space-y-6">
      {/* HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary rounded-2xl p-4 md:p-6 text-white shadow-lg">
        <div className="absolute -top-6 -right-6 text-8xl font-arabic opacity-10 select-none pointer-events-none">
          ﷽
        </div>
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Shield className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-bold">Registrar Dashboard</h2>
              <p className="text-gau-msa-gold text-xs md:text-sm">
                Manage members and registration requests
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              disabled={users.length === 0}
              className="bg-white/20 backdrop-blur hover:bg-white/30 text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold flex items-center space-x-1.5 transition disabled:opacity-40"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={() => setShowBulkModal(true)}
              className="bg-gau-msa-gold text-gau-msa-primary px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold flex items-center space-x-1.5 hover:opacity-90 transition"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Bulk Upload</span>
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: 'Total Members', value: stats.total, icon: Users, color: 'text-gau-msa-primary dark:text-gau-msa-gold', bg: 'bg-gau-msa-primary/10 dark:bg-gau-msa-gold/10' },
          { label: 'Verified', value: stats.verified, icon: UserCheck, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
          { label: 'Unverified', value: stats.unverified, icon: UserX, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
          { label: 'Admins', value: stats.admins, icon: Shield, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-3 md:p-4 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${s.bg}`}>
                <s.icon className={`h-4 w-4 md:h-5 md:w-5 ${s.color}`} />
              </div>
            </div>
            <p className="text-xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
              {s.value}
            </p>
            <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* TABS CARD */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
        {/* Tab bar */}
        <div className="flex border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
          {[
            { key: 'members', label: 'Members', icon: Users, count: users.length },
            { key: 'requests', label: 'Requests', icon: Clock, count: requests.length },
            { key: 'add', label: 'Add Member', icon: UserPlus },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-shrink-0 px-4 md:px-6 py-3 font-medium text-xs md:text-sm transition-colors flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'border-b-2 border-gau-msa-primary dark:border-gau-msa-gold text-gau-msa-primary dark:text-gau-msa-gold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-[10px] font-semibold">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-3 md:p-6">
          {/* ==================== MEMBERS ==================== */}
          {activeTab === 'members' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-2 md:gap-3">
                <div className="flex-1 min-w-[220px] relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search name, reg no, email…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-gau-msa-primary dark:focus:ring-gau-msa-gold text-sm"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="registrar">Registrar</option>
                  <option value="member">Member</option>
                </select>
                <select
                  value={filterVerified}
                  onChange={(e) => setFilterVerified(e.target.value)}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="true">Verified</option>
                  <option value="false">Unverified</option>
                </select>
              </div>

              {/* Loading / Table / Empty */}
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gau-msa-primary dark:text-gau-msa-gold" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No members found
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden md:block overflow-x-auto -mx-3 md:mx-0">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                          {['Reg No', 'Name', 'Email', 'Dept', 'Year', 'Role', 'Status', ''].map(
                            (h) => (
                              <th
                                key={h}
                                className="px-3 py-2.5 text-left text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                              >
                                {h}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {users.map((u) => (
                          <tr
                            key={u.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                          >
                            <td className="px-3 py-3 text-xs font-mono text-gray-700 dark:text-gray-300">
                              {u.reg_no || '—'}
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-gray-800 dark:text-gray-100">
                              {u.full_name}
                            </td>
                            <td className="px-3 py-3 text-xs text-gray-500 dark:text-gray-400">
                              {u.email}
                            </td>
                            <td className="px-3 py-3 text-xs text-gray-500 dark:text-gray-400">
                              {u.department || '—'}
                            </td>
                            <td className="px-3 py-3 text-xs text-gray-500 dark:text-gray-400">
                              {u.year_of_study || '—'}
                            </td>
                            <td className="px-3 py-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                                {u.role}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                  u.is_verified
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                }`}
                              >
                                {u.is_verified ? 'Verified' : 'Pending'}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleVerifyUser(u.id, !u.is_verified)}
                                  disabled={actionLoading === `verify-${u.id}`}
                                  className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition disabled:opacity-40"
                                  title={u.is_verified ? 'Unverify' : 'Verify'}
                                >
                                  {actionLoading === `verify-${u.id}` ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : u.is_verified ? (
                                    <XCircle className="h-4 w-4" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => openEdit(u)}
                                  className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition"
                                  title="Edit"
                                >
                                  <Pencil className="h-4 w-4" />
                                </button>
                                {isAdmin && (
                                  <button
                                    onClick={() => handleDeleteUser(u)}
                                    disabled={actionLoading === `delete-${u.id}`}
                                    className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 transition disabled:opacity-40"
                                    title="Delete"
                                  >
                                    {actionLoading === `delete-${u.id}` ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="md:hidden space-y-2">
                    {users.map((u) => (
                      <div
                        key={u.id}
                        className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">
                              {u.full_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {u.email}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${
                              u.is_verified
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                            }`}
                          >
                            {u.is_verified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 space-y-0.5 mb-2">
                          {u.reg_no && <p className="font-mono">{u.reg_no}</p>}
                          <p>
                            {u.department || '—'} • {u.year_of_study || '—'}
                          </p>
                          <p className="capitalize">Role: {u.role}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVerifyUser(u.id, !u.is_verified)}
                            className="flex-1 py-1.5 rounded-lg bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                          >
                            {u.is_verified ? 'Unverify' : 'Verify'}
                          </button>
                          <button
                            onClick={() => openEdit(u)}
                            className="flex-1 py-1.5 rounded-lg bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                          >
                            Edit
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="py-1.5 px-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-xs font-medium text-red-600 dark:text-red-400"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ==================== REQUESTS ==================== */}
          {activeTab === 'requests' && (
            <div className="space-y-3">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gau-msa-primary dark:text-gau-msa-gold" />
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No pending requests
                  </p>
                </div>
              ) : (
                requests.map((r) => (
                  <div
                    key={r.id}
                    className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3 md:p-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="flex items-start space-x-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gau-msa-primary/10 dark:bg-gau-msa-gold/20 flex items-center justify-center text-gau-msa-primary dark:text-gau-msa-gold font-bold flex-shrink-0">
                          {r.full_name?.charAt(0) || '?'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">
                            {r.full_name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {r.reg_no} • {r.email}
                          </p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500">
                            {r.department} • {r.year_of_study}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleApproveRequest(r.id)}
                          disabled={actionLoading === `approve-${r.id}`}
                          className="flex-1 md:flex-none px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-xs font-semibold hover:bg-green-200 dark:hover:bg-green-900/50 disabled:opacity-40 flex items-center justify-center gap-1"
                        >
                          {actionLoading === `approve-${r.id}` ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectRequest(r.id)}
                          disabled={actionLoading === `reject-${r.id}`}
                          className="flex-1 md:flex-none px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-xs font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-40 flex items-center justify-center gap-1"
                        >
                          {actionLoading === `reject-${r.id}` ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <X className="h-3.5 w-3.5" />
                          )}
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ==================== ADD MEMBER ==================== */}
          {activeTab === 'add' && (
            <form onSubmit={handleAddMember} className="max-w-2xl space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 rounded-r-lg p-3 flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  New members get the default password <strong>123456</strong>. They'll be prompted to change it on first login.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.reg_no}
                    onChange={(e) => setFormData({ ...formData, reg_no: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:ring-2 focus:ring-gau-msa-primary dark:focus:ring-gau-msa-gold"
                    placeholder="GAU-2024-001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:ring-2 focus:ring-gau-msa-primary dark:focus:ring-gau-msa-gold"
                    placeholder="Ahmed Hassan"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:ring-2 focus:ring-gau-msa-primary dark:focus:ring-gau-msa-gold"
                    placeholder="0712345678"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:ring-2 focus:ring-gau-msa-primary dark:focus:ring-gau-msa-gold"
                    placeholder="student@gaumsa.org"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department *
                  </label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:ring-2 focus:ring-gau-msa-primary dark:focus:ring-gau-msa-gold"
                  >
                    <option value="">Select…</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Year *
                  </label>
                  <select
                    required
                    value={formData.year_of_study}
                    onChange={(e) => setFormData({ ...formData, year_of_study: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:ring-2 focus:ring-gau-msa-primary dark:focus:ring-gau-msa-gold"
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                {isAdmin && (
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm focus:ring-2 focus:ring-gau-msa-primary dark:focus:ring-gau-msa-gold"
                    >
                      {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={actionLoading === 'add'}
                className="bg-gau-msa-primary dark:bg-gau-msa-gold text-white dark:text-gray-900 px-5 py-2.5 rounded-lg hover:bg-gau-msa-secondary dark:hover:opacity-90 transition flex items-center space-x-2 text-sm font-semibold disabled:opacity-50"
              >
                {actionLoading === 'add' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                <span>Add Member</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ==================== TOASTS ==================== */}
      <div className="fixed bottom-4 right-4 z-[60] space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-xl shadow-lg px-4 py-3 flex items-start space-x-2 text-sm max-w-xs animate-slide-in ${
              t.type === 'success'
                ? 'bg-green-500 text-white'
                : t.type === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-blue-500 text-white'
            }`}
          >
            {t.type === 'success' && <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
            {t.type === 'error' && <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
            {t.type === 'info' && <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* ==================== CONFIRM ==================== */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">
              {confirmDialog.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {confirmDialog.message}
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const cb = confirmDialog.onConfirm;
                  setConfirmDialog(null);
                  await cb();
                }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition ${
                  confirmDialog.tone === 'danger'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gau-msa-primary dark:bg-gau-msa-gold hover:bg-gau-msa-secondary dark:hover:opacity-90'
                }`}
              >
                {confirmDialog.confirmLabel || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== EDIT MODAL ==================== */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Edit Member
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="p-4 space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={editForm.reg_no}
                  onChange={(e) => setEditForm({ ...editForm, reg_no: e.target.value })}
                  placeholder="Reg no"
                  className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-sm"
                />
                <input
                  value={editForm.full_name}
                  onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  placeholder="Full name"
                  className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-sm"
                />
                <input
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="Phone"
                  className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-sm"
                />
                <select
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-sm"
                >
                  <option value="">Department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <select
                  value={editForm.year_of_study}
                  onChange={(e) => setEditForm({ ...editForm, year_of_study: e.target.value })}
                  className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-sm"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                {isAdmin && (
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-sm"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === `edit-${editingUser.id}`}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-gau-msa-primary dark:bg-gau-msa-gold text-white dark:text-gray-900 hover:bg-gau-msa-secondary dark:hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {actionLoading === `edit-${editingUser.id}` && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== BULK MODAL ==================== */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Bulk Upload Members
              </h3>
              <button
                onClick={() => setShowBulkModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 rounded-r-lg p-3">
                <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold mb-1">
                  Format
                </p>
                <code className="text-[11px] bg-white dark:bg-gray-900 p-1.5 rounded block text-gray-800 dark:text-gray-200 break-all">
                  REG_NO, NAME, PHONE, EMAIL, DEPARTMENT, YEAR
                </code>
                <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-1">
                  Default password: <strong>123456</strong>
                </p>
              </div>
              <textarea
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-mono text-xs"
                placeholder={`GAU-2024-001, Ahmed Hassan, 0712345678, ahmed@student.gau.ac.ke, Computer Science, 1st Year
GAU-2024-002, Fatima Abdullah, 0723456789, fatima@student.gau.ac.ke, Education, 1st Year`}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {bulkData.split('\n').filter((l) => l.trim()).length} rows ready
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowBulkModal(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkRegister}
                    disabled={bulkLoading || !bulkData.trim()}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-gau-msa-primary dark:bg-gau-msa-gold text-white dark:text-gray-900 hover:bg-gau-msa-secondary dark:hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {bulkLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrarDashboard;