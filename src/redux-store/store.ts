import FSStorage from 'redux-persist-fs-storage';
import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import {rootReducer} from './reducers';
import createSagaMiddleware from 'redux-saga';
import {rootSaga} from '../features/counter/saga';

/**
 * Create redux persist configurations object.
 */
const persistConfig = {
  key: 'root',
  vsrsion: 1,
  keyPrefix: '',
  storage: FSStorage(),
};

/**
 * Create an enhanced reducer with persist redux.
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();

/**
 * Configure the redux store.
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // thunk: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(sagaMiddleware),
});

/**
 * Method to run after rehydration.
 */
const postRehydration = () => {
  console.log(
    '=>>>>>>>>>post rehydration<<<<<<<<<<<<<=',
    store.getState().counterStore,
  );
};

/**
 * Compose the persistor object.
 * @param store instance of redux store.
 * @param config the persistor config object.
 * @param callback the method to run after rehydration.
 */
export const persistor = persistStore(store, null, postRehydration);

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
