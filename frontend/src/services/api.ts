const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // ==================== AUTH ====================
  signup: async (email: string, password: string, full_name: string) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name }),
    });
    return response.json();
  },

  signin: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  getMe: async (token: string) => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  // ✅ NEW: Update profile (for the completion modal)
  updateProfile: async (
    token: string,
    data: {
      reg_no: string;
      department: string;
      year_of_study: string;
      phone?: string;
    }
  ) => {
    const response = await fetch(`${API_URL}/auth/update-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // ==================== ACTIVITIES ====================
  getActivities: async (category?: string, status?: string) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (status && status !== 'all') params.append('status', status);
    const response = await fetch(`${API_URL}/activities?${params.toString()}`);
    return response.json();
  },

  registerForActivity: async (token: string, activityId: string) => {
    const response = await fetch(`${API_URL}/activities/${activityId}/register`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  // ==================== LEADERS ====================
  getLeaders: async () => {
    const response = await fetch(`${API_URL}/leaders`);
    return response.json();
  },

  // ==================== PRAYER TIMES ====================
  getPrayerTimes: async () => {
    const response = await fetch(`${API_URL}/prayer-times`);
    return response.json();
  },

  // ==================== CHAT ====================
  getMessages: async (token: string, limit?: number) => {
    const response = await fetch(`${API_URL}/chat?limit=${limit || 50}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  sendMessage: async (token: string, content: string) => {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });
    return response.json();
  },

  // ==================== ADMIN/REGISTRAR ====================
  getUsers: async (
    token: string,
    params?: {
      search?: string;
      role?: string;
      verified?: string;
      department?: string;
    }
  ) => {
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_URL}/admin/users?${query}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  createUser: async (token: string, userData: any) => {
    const response = await fetch(`${API_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  bulkCreateUsers: async (token: string, users: any[]) => {
    const response = await fetch(`${API_URL}/admin/users/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ users }),
    });
    return response.json();
  },

  verifyUser: async (token: string, userId: string, is_verified: boolean) => {
    const response = await fetch(`${API_URL}/admin/users/${userId}/verify`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ is_verified }),
    });
    return response.json();
  },

  getRegistrationRequests: async (
    token: string,
    params?: { status?: string; search?: string }
  ) => {
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(
      `${API_URL}/admin/registration-requests?${query}`,
      {
        headers: { 'Authorization': `Bearer ${token}` },
      }
    );
    return response.json();
  },

  approveRegistration: async (token: string, requestId: string) => {
    const response = await fetch(
      `${API_URL}/admin/registration-requests/${requestId}/approve`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      }
    );
    return response.json();
  },

  rejectRegistration: async (token: string, requestId: string) => {
    const response = await fetch(
      `${API_URL}/admin/registration-requests/${requestId}/reject`,
      {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` },
      }
    );
    return response.json();
  },

  getStats: async (token: string) => {
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  // ==================== RAMADAN PAYMENTS ====================
  initiateRamadanPayment: async (data: {
    reg_no: string;
    full_name: string;
    phone: string;
  }) => {
    const response = await fetch(`${API_URL}/ramadan/payments/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  checkRamadanPaymentStatus: async (checkoutId: string) => {
    const response = await fetch(
      `${API_URL}/ramadan/payments/status/${checkoutId}`
    );
    return response.json();
  },

  getMyRamadanPayments: async (token: string) => {
    const response = await fetch(`${API_URL}/ramadan/payments/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  getRamadanPayments: async (
    token: string,
    params?: { status?: string; search?: string }
  ) => {
    const query = new URLSearchParams();

    if (params?.status && params.status !== 'all') {
      query.append('status', params.status);
    }
    if (params?.search && params.search.trim()) {
      query.append('search', params.search.trim());
    }

    const queryString = query.toString();
    const url = `${API_URL}/ramadan/payments${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  getRamadanStats: async (token: string) => {
    const response = await fetch(`${API_URL}/ramadan/payments/stats`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.json();
  },

  verifyRamadanPayment: async (
    token: string,
    paymentId: string,
    data: { status: string; notes?: string }
  ) => {
    const response = await fetch(
      `${API_URL}/ramadan/payments/${paymentId}/verify`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  },
};