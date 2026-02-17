import axios from './axios';

// Authentication
export async function checkAuth(): Promise<boolean> {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    const response = await axios.get('/auth/me');
    return response.status === 200;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
}

export async function login(username: string, password: string) {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await axios.post('/auth/login', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  // Store token
  if (response.data.access_token) {
    localStorage.setItem('access_token', response.data.access_token);
  }

  return response.data;
}

export async function logout(): Promise<void> {
  try {
    await axios.post('/auth/logout');
    localStorage.removeItem('access_token');
  } catch (error) {
    console.error('Logout failed:', error);
    // Clear token anyway
    localStorage.removeItem('access_token');
  }
}

// Portfolio
export async function getPortfolio(language: string = 'en') {
  const response = await axios.get('/portfolio', {
    params: { language },
  });
  return response.data;
}

export async function updatePortfolio(data: any, language: string = 'en') {
  const response = await axios.put('/portfolio', { data }, {
    params: { language },
  });
  return response.data;
}

export async function getPortfolioHistory(skip = 0, limit = 10) {
  const response = await axios.get('/portfolio/history', {
    params: { skip, limit },
  });
  return response.data;
}

// Feedback
export async function submitFeedback(feedback: {
  name: string;
  email?: string;
  message: string;
  rating?: number;
}) {
  const response = await axios.post('/feedback', feedback);
  return response.data;
}

export async function getApprovedFeedback() {
  const response = await axios.get('/feedback/approved');
  return response.data;
}

export async function getPendingFeedback() {
  const response = await axios.get('/feedback/pending');
  return response.data;
}

export async function getAllFeedback() {
  const response = await axios.get('/feedback/all');
  return response.data;
}

export async function approveFeedback(feedbackId: number, approve: boolean) {
  const response = await axios.patch(`/feedback/${feedbackId}/approve`, {
    approve,
  });
  return response.data;
}

export async function deleteFeedback(feedbackId: number) {
  const response = await axios.delete(`/feedback/${feedbackId}`);
  return response.data;
}

// Contact Email
export async function sendContactEmail(contact: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const response = await axios.post('/contact/send-email', contact);
  return response.data;
}