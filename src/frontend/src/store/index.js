import { configureStore } from '@reduxjs/toolkit';
import profileSlice from './slices/profileSlice';

const store = configureStore({
  reducer: {
    profile: profileSlice,
  },
});

export default store;
