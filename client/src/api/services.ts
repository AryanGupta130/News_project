import api from './config';

// Types for API responses and data
export interface UserPreferences {
  newsInterests: string;
  readingFormat: 'summary' | 'full' | 'headlines';
  deliveryTime: 'morning' | 'afternoon' | 'evening';
}

export interface NewsArticle {
  title: string;
  summary: string;
  url: string;
  source: string;
  published_at: string;
  relevance_score?: number;
  why_relevant?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface PreferencesResponse {
  success: boolean;
  preferences?: UserPreferences;
  message?: string;
  error?: string;
}

export interface ProcessNewsResponse {
  success: boolean;
  articles?: NewsArticle[];
  message?: string;
  error?: string;
}

// API Service Class
class ApiService {
  
  // User Preferences Methods
  async saveUserPreferences(userId: string, preferences: UserPreferences): Promise<ApiResponse> {
    try {
      const response = await api.post('/api/preferences', {
        user_id: userId,
        preferences: preferences
      });
      
      return {
        success: true,
        message: response.data.message,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to save preferences'
      };
    }
  }

  async getUserPreferences(userId: string): Promise<PreferencesResponse> {
    try {
      const response = await api.get(`/api/preferences/${userId}`);
      
      return {
        success: true,
        preferences: response.data.preferences
      };
    } catch (error: any) {
      console.error('Error getting preferences:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to get preferences'
      };
    }
  }

  // News Processing Methods
  async processNewsForUser(userId: string): Promise<ProcessNewsResponse> {
    try {
      const response = await api.post('/api/process-news', {
        user_id: userId
      });
      
      return {
        success: true,
        articles: response.data.articles,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Error processing news:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to process news'
      };
    }
  }

  // Batch processing (admin function)
  async batchProcessAllUsers(): Promise<ApiResponse> {
    try {
      const response = await api.post('/api/users/batch-process');
      
      return {
        success: true,
        message: response.data.message,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error in batch processing:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to batch process users'
      };
    }
  }

  // Authentication Methods (if you want to use your backend auth instead of Firebase)
  async login(email: string, password: string): Promise<ApiResponse> {
    try {
      const response = await api.post('/api/login', {
        email,
        password
      });
      
      return {
        success: true,
        message: response.data.message,
        data: { user: response.data.user }
      };
    } catch (error: any) {
      console.error('Error logging in:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await api.post('/api/logout');
      
      return {
        success: true,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Error logging out:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Logout failed'
      };
    }
  }

  async getCurrentUser(): Promise<ApiResponse> {
    try {
      const response = await api.get('/api/user');
      
      return {
        success: true,
        data: {
          user: response.data.user,
          authenticated: response.data.authenticated
        }
      };
    } catch (error: any) {
      console.error('Error getting current user:', error);
      return {
        success: false,
        error: 'Failed to get current user'
      };
    }
  }

  // Health check method
  async checkServerHealth(): Promise<ApiResponse> {
    try {
      const response = await api.get('/');
      
      return {
        success: true,
        message: response.data.message,
        data: response.data
      };
    } catch (error: any) {
      console.error('Error checking server health:', error);
      return {
        success: false,
        error: 'Server is not responding'
      };
    }
  }
}

// Export a singleton instance
export const apiService = new ApiService();
export default apiService;
