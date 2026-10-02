import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { 
  Users, UserPlus, Upload, Search, Filter, 
  Check, X, Clock, Download, Trash2, Edit,
  FileSpreadsheet, AlertCircle, ChevronRight,
  UserCheck, UserX, Mail, Phone, BookOpen
} from 'lucide-react';

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

const RegistrarDashboard: React.FC = () => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'members' | 'requests' | 'add'>('members');
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterVerified, setFilterVerified] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Add Member Form
  const [formData, setFormData] = useState({
    reg_no: '',
    full_name: '',
    phone: '',
    email: '',
    department: '',
    year_of_study: '1st Year'
  });
  
  // Bulk Registration
  const [bulkData, setBulkData] = useState('');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkResults, setBulkResults] = useState<any>(null);

  const departments = [
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
    'Islamic Theology'
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate Student'];

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'members') {
        const res = await api.getUsers(token!, { search, role: filterRole, verified: filterVerified });
        if (res.success) setUsers(res.data);
      } else if (activeTab === 'requests') {
        const res = await api.getRegistrationRequests(token!, { status: 'pending' });
        if (res.success) setRequests(res.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.createUser(token!, formData);
    if (res.success) {
      alert('Member added successfully!');
      setFormData({
        reg_no: '',
        full_name: '',
        phone: '',
        email: '',
        department: '',
        year_of_study: '1st Year'
      });
      loadData();
    } else {
      alert('Error: ' + res.error);
    }
  };

  const handleBulkRegister = async () => {
    try {
      const lines = bulkData.split('\n').filter(line => line.trim());
      const users = lines.map(line => {
        const [reg_no, full_name, phone, email, department, year] = line.split(',').map(s => s.trim());
        return { 
          reg_no, 
          full_name, 
          phone, 
          email, 
          department, 
          year_of_study: year || '1st Year' 
        };
      });

      if (users.length === 0) {
        alert('Please enter valid data');
        return;
      }

      const res = await api.bulkCreateUsers(token!, users);
      if (res.success) {
        setBulkData('');
        setShowBulkModal(false);
        loadData();
        setBulkResults(res);
        alert(res.message || 'Users registered successfully');
      } else {
        alert('Error: ' + res.error);
      }
    } catch (error) {
      alert('Error processing bulk data');
    }
  };

  const handleVerifyUser = async (userId: string, verified: boolean) => {
    if (!confirm(`Are you sure you want to ${verified ? 'verify' : 'unverify'} this user?`)) return;
    
    const res = await api.verifyUser(token!, userId, verified);
    if (res.success) {
      loadData();
      alert('User updated successfully');
    } else {
      alert('Error: ' + res.error);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to approve this registration?')) return;
    
    const res = await api.approveRegistration(token!, requestId);
    if (res.success) {
      loadData();
      alert('Registration approved! User account created.');
    } else {
      alert('Error: ' + res.error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to reject this registration?')) return;
    
    const res = await api.rejectRegistration(token!, requestId);
    if (res.success) {
      loadData();
      alert('Registration rejected.');
    } else {
      alert('Error: ' + res.error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gau-msa-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gau-msa-primary to-gau-msa-secondary rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Registrar Dashboard</h2>
            <p className="text-gau-msa-gold mt-1">Manage members and registration requests</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowBulkModal(true)}
              className="bg-gau-msa-gold text-gau-msa-primary px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Bulk Upload</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'members'
                ? 'border-b-2 border-gau-msa-primary text-gau-msa-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Members ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'requests'
                ? 'border-b-2 border-gau-msa-primary text-gau-msa-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock className="h-4 w-4 inline mr-2" />
            Pending Requests ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'add'
                ? 'border-b-2 border-gau-msa-primary text-gau-msa-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <UserPlus className="h-4 w-4 inline mr-2" />
            Add Member
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Members Tab */}
          {activeTab === 'members' && (
            <div>
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, reg no, or email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && loadData()}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="registrar">Registrar</option>
                  <option value="member">Member</option>
                </select>
                <select
                  value={filterVerified}
                  onChange={(e) => setFilterVerified(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary"
                >
                  <option value="all">All Status</option>
                  <option value="true">Verified</option>
                  <option value="false">Unverified</option>
                </select>
                <button
                  onClick={loadData}
                  className="bg-gau-msa-primary text-white px-4 py-2 rounded-lg hover:bg-gau-msa-secondary transition"
                >
                  Apply Filters
                </button>
              </div>

              {/* Members Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reg No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono">{user.reg_no || '-'}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.full_name}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{user.department || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{user.year_of_study || '-'}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.is_verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleVerifyUser(user.id, !user.is_verified)}
                              className={`p-1 rounded ${
                                user.is_verified ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={user.is_verified ? 'Unverify' : 'Verify'}
                            >
                              {user.is_verified ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              {requests.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No pending registration requests</p>
                </div>
              ) : (
                requests.map((request) => (
                  <div key={request.id} className="bg-gray-50 rounded-lg p-4 flex flex-wrap items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gau-msa-primary/10 flex items-center justify-center text-gau-msa-primary font-bold">
                        {request.full_name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{request.full_name}</h4>
                        <div className="text-sm text-gray-500">
                          <span className="font-mono">{request.reg_no}</span>
                          <span className="mx-2">•</span>
                          <span>{request.email}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {request.department} • {request.year_of_study}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveRequest(request.id)}
                            className="px-3 py-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition text-sm"
                          >
                            <Check className="h-4 w-4 inline mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.id)}
                            className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition text-sm"
                          >
                            <X className="h-4 w-4 inline mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Add Member Tab */}
          {activeTab === 'add' && (
            <form onSubmit={handleAddMember} className="max-w-2xl space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.reg_no}
                    onChange={(e) => setFormData({ ...formData, reg_no: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent"
                    placeholder="GAU-2024-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent"
                    placeholder="Ahmed Hassan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent"
                    placeholder="0712345678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent"
                    placeholder="student@gaumsa.org"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year of Study *
                  </label>
                  <select
                    required
                    value={formData.year_of_study}
                    onChange={(e) => setFormData({ ...formData, year_of_study: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary focus:border-transparent"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="bg-gau-msa-primary text-white px-6 py-2 rounded-lg hover:bg-gau-msa-secondary transition flex items-center space-x-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add Member</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gau-msa-primary">Bulk Registration</h3>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-sm text-blue-700">
                <strong>Format:</strong> One user per line with comma-separated values
              </p>
              <code className="text-xs block mt-2 bg-white p-2 rounded">
                REG_NO, FULL_NAME, PHONE, EMAIL, DEPARTMENT, YEAR
              </code>
            </div>
            
            <textarea
              value={bulkData}
              onChange={(e) => setBulkData(e.target.value)}
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gau-msa-primary font-mono text-sm"
              placeholder="GAU-2024-001, Ahmed Hassan, 0712345678, ahmed@student.gau.ac.ke, Computer Science, 1st Year
GAU-2024-002, Fatima Abdullah, 0723456789, fatima@student.gau.ac.ke, Education, 1st Year
GAU-2024-003, Omar Faruq, 0734567890, omar@student.gau.ac.ke, Business Administration, 1st Year"
            />
            
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-500">
                {bulkData.split('\n').filter(line => line.trim()).length} users ready
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkRegister}
                  className="bg-gau-msa-primary text-white px-4 py-2 rounded-lg hover:bg-gau-msa-secondary transition flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Register Users</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrarDashboard;