import type { User } from "@/types/auth";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    authSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
      state.error = null;

      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", action.payload.token);
      }
    },

    authFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = action.payload;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
    },

    clearError: (state) => {
      state.error = null;
    },

    initializeAuth: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token) {
          state.token = token;
        }
      }
    },

    setUser: (state, action: PayloadAction<{ id: string }>) => {
      state.user = {
        id: action.payload.id,
        createdAt: new Date().toISOString(),
      };
      state.isAuthenticated = true;
    },
  },
});

export const {
  authStart,
  authSuccess,
  authFailure,
  logout,
  clearError,
  initializeAuth,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;
