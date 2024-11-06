import axios from 'axios';

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
  deleteQuestion: (questionId: string) => {
    return axios.delete(`/api/questions/${questionId}`);
  },
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
  const interval = setInterval(async () => {
    try {
      const { data } = await roomAPI.getRoomDetails(roomId);
      callback(data);
    } catch (error) {
      console.error('Error polling for updates:', error);
    }
  }, 5000); // Poll every 5 seconds

  return () => clearInterval(interval);
};

// Add this to the existing API definitions
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
}; 