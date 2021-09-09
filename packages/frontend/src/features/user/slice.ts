import { createSlice } from '@reduxjs/toolkit';
import ApiError from '../../errors/ApiError';
import User from '../../types/User';
import createApiThunk from '../../utils/createApiThunk';
import * as api from './api';

type State = {
  data?: User;
  signInPending: boolean;
  signUpPending: boolean;
  logoutPending: boolean;
  signInError?: string;
  signUpError?: string;
  logoutError?: string;
};

const initialState: State = {
  signInPending: false,
  signUpPending: false,
  logoutPending: false,
};

const sliceName = 'user';

export const signIn = createApiThunk(sliceName, 'signIn', api.signIn);
export const signUp = createApiThunk(sliceName, 'signUp', api.signUp);
export const logout = createApiThunk(sliceName, 'logout', api.logout);

const userSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    removeSignInError: (state) => {
      state.signInError = undefined;
    },
    removeSignUpError: (state) => {
      state.signUpError = undefined;
    },
    removeLogoutError: (state) => {
      state.logoutError = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.signInPending = true;
      })
      .addCase(signIn.fulfilled, (state, { payload: user }) => {
        state.signInPending = false;
        state.data = user;
      })
      .addCase(signIn.rejected, (state, { error }) => {
        state.signInPending = false;
        console.log(error);
        state.signInError = (error as ApiError).message;
      });

    builder
      .addCase(signUp.pending, (state) => {
        state.signUpPending = true;
      })
      .addCase(signUp.fulfilled, (state) => {
        state.signUpPending = false;
      })
      .addCase(signUp.rejected, (state, { error }) => {
        state.signUpPending = false;
        console.log(error);
        state.signUpError = (error as ApiError).message;
      });

    builder
      .addCase(logout.pending, (state) => {
        state.signUpPending = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.logoutPending = false;
      })
      .addCase(logout.rejected, (state, { error }) => {
        state.logoutPending = false;
        console.log(error);
        state.logoutError = (error as ApiError).message;
      });
  },
});

export const { removeSignInError, removeSignUpError, removeLogoutError } =
  userSlice.actions;

const userReducer = userSlice.reducer;
export default userReducer;
