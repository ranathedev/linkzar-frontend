import { configureStore, PayloadAction } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'

const prefersDarkMode =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches

const initialState = {
  theme: prefersDarkMode ? 'light' : 'dark',
}

const persistConfig = {
  key: 'root',
  storage,
}

export const setTheme = (theme: string) => ({
  type: 'SET_THEME',
  payload: theme,
})

const themeReducer = (state = initialState, action: PayloadAction) => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      }
    case 'CLEAR_STATE':
      return initialState
    default:
      return state
  }
}

//@ts-ignore
const persistedReducer = persistReducer(persistConfig, themeReducer)

const store = configureStore({
  //@ts-ignore
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

const persistor = persistStore(store)

export { store, Provider, persistor, PersistGate }
