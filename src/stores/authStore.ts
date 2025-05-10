import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useToast } from '../composables/useToast';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', () => {
  const state = ref<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const { error: showError } = useToast();

  const handleLogin = async (email: string): Promise<void> => {
    try {
      // TODO: Implement actual login API call
      state.value.user = {
        id: '1',
        email,
        name: 'John Doe',
      };
      state.value.isAuthenticated = true;
    } catch (err) {
      showError('Failed to login. Please try again.');
      throw err;
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      // TODO: Implement actual logout API call
      state.value.user = null;
      state.value.isAuthenticated = false;
    } catch (err) {
      showError('Failed to logout. Please try again.');
      throw err;
    }
  };

  return {
    user: computed(() => state.value.user),
    isAuthenticated: computed(() => state.value.isAuthenticated),
    handleLogin,
    handleLogout,
  };
});
