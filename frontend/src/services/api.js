
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  }
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await fetch(`${API_URL}/user/profile`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  updateProfile: async (data) => {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  changePassword: async (data) => {
    const response = await fetch(`${API_URL}/user/change-password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  },

  getAllQuestions: async () => {
    const response = await fetch(`${API_URL}/user/questions`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getMyQuestions: async () => {
    const response = await fetch(`${API_URL}/user/my-questions`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  answerQuestion: async (id, answer) => {
    const response = await fetch(`${API_URL}/user/questions/${id}/answer`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ answer })
    });
    return response.json();
  },

  askQuestion: async (questionText) => {
    const response = await fetch(`${API_URL}/user/ask`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ questionText })
    });
    return response.json();
  },

  sendMessage: async (text, adminId) => {
    const response = await fetch(`${API_URL}/user/message`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text, adminId })
    });
    return response.json();
  }
};

// Admin API
export const adminAPI = {
  getUsers: async () => {
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  getUser: async (id) => {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      headers: getAuthHeaders()
    });
    return response.json();
  },

  deleteUser: async (id) => {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  updateUserRole: async (id, role) => {
    const response = await fetch(`${API_URL}/admin/users/${id}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role })
    });
    return response.json();
  },

  createQuestion: async (questionText) => {
    const response = await fetch(`${API_URL}/admin/questions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ questionText })
    });
    return response.json();
  },

  respondToQuestion: async (id, answer) => {
    const response = await fetch(`${API_URL}/admin/questions/${id}/respond`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ answer })
    });
    return response.json();
  },

  deleteQuestion: async (id) => {
    const response = await fetch(`${API_URL}/admin/questions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  },

  clearAnswer: async (id) => {
    const response = await fetch(`${API_URL}/admin/questions/${id}/delete-answer`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

export default { auth: authAPI, user: userAPI, admin: adminAPI };