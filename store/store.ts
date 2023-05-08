import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "redux"
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from "redux-persist"
import storage from "redux-persist/lib/storage"

import userReducer from "../slices/userSlice"

const persistConfig = {
  key: "root",
  storage,
}
const reducers = combineReducers({
  user: userReducer,
})
const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
