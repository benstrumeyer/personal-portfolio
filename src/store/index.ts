import { configureStore } from '@reduxjs/toolkit';
import skyReducer from './skySlice';

/**
 * Redux store configuration for the sky system
 * 
 * This store manages all sky-related state including:
 * - Global time and day/night cycles
 * - Module configurations and performance settings
 * - Sky colors and atmospheric effects
 */

export const store = configureStore({
  reducer: {
    sky: skyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['sky/updateTime', 'sky/updateFrameRate'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['sky.global.lastUpdateTime', 'sky.performance.lastFrameTime'],
      },
    }),
  devTools: import.meta.env.DEV,
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export store instance
export default store;
