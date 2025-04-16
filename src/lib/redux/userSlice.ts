
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
}

interface UserState {
  userInfo: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  userInfo: null,
  token: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{
        user: UserInfo;
        token: string;
      }>
    ) {
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.userInfo = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
