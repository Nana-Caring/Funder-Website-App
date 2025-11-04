import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  globalLoading: false,
  loadingCount: 0,
  message: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showLoading: (state, action) => {
      state.loadingCount += 1;
      state.globalLoading = true;
      if (action?.payload?.message) state.message = action.payload.message;
    },
    hideLoading: (state) => {
      state.loadingCount = Math.max(0, state.loadingCount - 1);
      state.globalLoading = state.loadingCount > 0;
      if (!state.globalLoading) state.message = null;
    },
    setLoading: (state, action) => {
      const val = Boolean(action.payload);
      state.globalLoading = val;
      state.loadingCount = val ? Math.max(1, state.loadingCount || 1) : 0;
    },
    setLoadingMessage: (state, action) => {
      state.message = action.payload || null;
    },
    resetUi: () => initialState,
  }
});

export const { showLoading, hideLoading, setLoading, setLoadingMessage, resetUi } = uiSlice.actions;
export default uiSlice.reducer;
