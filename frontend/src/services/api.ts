import axios from 'axios';
import { removeToken } from '../utils/auth';
import { POLLING_INTERVAL } from '../utils/constants';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token validation errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove invalid token
      removeToken();
      // Redirect to signup page
      window.location.href = '/SignUp';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data: { fullName: string; email: string; password: string; termsAccepted: boolean }) =>
    api.post('/auth/signup', data),
  signin: (data: { email: string; password: string }) =>
    api.post('/auth/signin', data),
};

// Room APIs
export const roomAPI = {
  createRoom: (data: { name: string; duration?: number }) =>
    api.post('/rooms', data),
  joinRoom: (code: string) =>
    api.post('/rooms/join', { code }),
  getRoomDetails: (roomId: string) =>
    api.get(`/rooms/${roomId}`),
  getMyRooms: () =>
    api.get('/rooms/my-rooms'),
  endRoom: (roomId: string) =>
    api.patch(`/rooms/${roomId}/end`),
};

// Question APIs
export const questionAPI = {
  getQuestions: (roomId: string) =>
    api.get(`/questions/room/${roomId}`),
  createQuestion: (data: { content: string; roomId: string; isAnonymous: boolean }) =>
    api.post('/questions', data),
  voteQuestion: (questionId: string) =>
    api.post(`/questions/${questionId}/vote`),
  updateQuestionStatus: (questionId: string, status: string) =>
    api.patch(`/questions/${questionId}/status`, { status }),
  deleteQuestion: (questionId: string) =>
    api.delete(`/questions/${questionId}`),
  addAnswer: (questionId: string, data: { text: string; author: string }) =>
    api.post(`/questions/${questionId}/answers`, data),
};

// Poll APIs
export const pollAPI = {
  getPolls: (roomId: string) =>
    api.get(`/polls/room/${roomId}`),
  createPoll: (data: { question: string; options: string[]; roomId: string }) =>
    api.post('/polls', data),
  votePoll: (pollId: string, data: { optionIndex: number; anonymous: boolean }) =>
    api.post(`/polls/${pollId}/vote`, data),
  endPoll: (pollId: string) =>
    api.patch(`/polls/${pollId}/end`),
};

// Polling function for real-time updates
export const pollForUpdates = (roomId: string, callback: (data: any) => void) => {
  // Initial fetch immediately
  const fetchUpdates = async () => {
    try {
      const { data } = await roomAPI.getRoomDetails(roomId);
      const transformedData = {
        questions: data.questions.map((q: any) => ({
          ...q,
          id: q._id,
          text: q.content,
        })),
        polls: data.polls.map((p: any) => ({
          ...p,
          id: p._id,
          options: p.options.map((opt: any) => ({
            text: opt.text,
            votes: opt.votes
          }))
        }))
      };
      callback(transformedData);
    } catch (error) {
      console.error('Error polling for updates:', error);
    }
  };

  // Execute initial fetch
  fetchUpdates();

  // Set up interval
  const interval = setInterval(fetchUpdates, POLLING_INTERVAL);

  return () => clearInterval(interval);
};

// Add this to the existing API definitions
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
}; 