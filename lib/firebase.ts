import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-ignore
import { Auth, getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const isAppAlreadyInitialized = getApps().length > 0;
const app = isAppAlreadyInitialized ? getApp() : initializeApp(firebaseConfig);

// Initialize auth with persistence for React Native
let auth: Auth;
if (isAppAlreadyInitialized) {
  auth = getAuth(app);
} else {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
    console.log("[Firebase] Auth initialized with AsyncStorage persistence");
  } catch (e) {
    console.log("[Firebase] initializeAuth failed or already called, falling back to getAuth");
    auth = getAuth(app);
  }
}
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
