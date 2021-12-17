/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import {ImageBackground, View} from 'react-native';

const SplashScreen = () => {
  return (
    <View style={{flex: 1}}>
      <ImageBackground
        resizeMode="cover"
        style={{flex: 1, height: '100%'}}
        source={require('../assets/tinder.jpg')}
      />
    </View>
  );
};

export default SplashScreen;
