import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { type AuthState, type StoredUser } from "../../types";
import { authenticateUser } from "../../services/mockUsers";
import type { PayloadAction } from "@reduxjs/toolkit";

const loadUserFromStorage = (): StoredUser | null => {
  try {
    const userStr = localStorage.getItem("fleet_user");
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error("Error loading user from storage:", error);
  }
  return null;
};

const initialState: AuthState = {
  user: loadUserFromStorage(),
  isAuthenticated: !!loadUserFromStorage(),
  isLoading: false,
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { username: string; password: string },
    { rejectWithValue }
  ) => {
    const user = authenticateUser(credentials.username, credentials.password);
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem("fleet_user", JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    } else {
      return rejectWithValue("Invalid username or password");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("fleet_user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<StoredUser>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
