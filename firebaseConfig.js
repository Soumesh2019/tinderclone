/* eslint-disable prettier/prettier */
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getDatabase} from 'firebase/database';
import {API_KEY, MESSAGE_ID, APP_ID} from '@env';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: 'tinderclone-50802.firebaseapp.com',
  projectId: 'tinderclone-50802',
  storageBucket: 'tinderclone-50802.appspot.com',
  messagingSenderId: MESSAGE_ID,
  appId: APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
