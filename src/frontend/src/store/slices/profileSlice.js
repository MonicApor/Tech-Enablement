import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setProfile, addBookmark, removeBookmark } = profileSlice.actions;

export default profileSlice.reducer;
