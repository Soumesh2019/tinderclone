/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React, {useEffect} from 'react';
import {View, Text, ImageBackground, StyleSheet} from 'react-native';
import {WEB_CLIENT} from '@env';
import useAuth from '../hooks/useAuth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

const LoginScreen = () => {
  const {signIn, loading} = useAuth();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '555382260260-bhd7jc87ophah6ds2fnc3blmgrhsc48l.apps.googleusercontent.com',
      scopes: ['email', 'profile'],
      offlineAccess: true,
    });
  }, []);

  return (
    <View
      style={{
        height: '100%',
      }}>
      <ImageBackground
        source={require('../assets/tinder.jpg')}
        resizeMode="cover"
        style={styles.background}>
        {loading && <Text style={styles.title}>Loading...</Text>}
        <GoogleSigninButton
          onPress={() => signIn()}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          style={styles.button}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 100,
  },

  background: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontStyle: 'italic',
    marginTop: 40,
  },
});

export default LoginScreen;
