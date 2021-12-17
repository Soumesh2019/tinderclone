/* eslint-disable prettier/prettier */
import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithCredential,
} from 'firebase/auth';
import {auth} from '../firebaseConfig';
import SplashScreen from '../screens/SplashScreen';

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [error, seterror] = useState(null);
  const [user, setuser] = useState(null);
  const [loadingInitial, setloadingInitial] = useState(true);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, userinfo => {
      if (userinfo) {
        setuser(userinfo);
      } else {
        setuser(null);
      }
      setloadingInitial(false);
    });

    return () => unsub();
  }, []);

  const signIn = async () => {
    setloading(true);
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      await GoogleSignin.signIn();
      const currerntUser = await GoogleSignin.getTokens();
      const {idToken, accessToken} = currerntUser;
      const credential = GoogleAuthProvider.credential(idToken, accessToken);

      await signInWithCredential(auth, credential);
    } catch (err) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        seterror('Sigin In Cancelled');
        return Promise.reject();
      } else if (err.code === statusCodes.IN_PROGRESS) {
        seterror('In Progress');
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        seterror('Play Services not Available');
        return Promise.reject();
      } else {
        seterror(err);
      }
    }

    setloading(false);
  };

  const logOut = async () => {
    setloading(true);
    signOut(auth)
      .catch(err => seterror(err))
      .finally(() => setloading(false));
  };

  return (
    <AuthContext.Provider value={{user, signIn, logOut, error, loading}}>
      {loadingInitial ? <SplashScreen /> : children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
