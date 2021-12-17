import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
// import {LogBox} from 'react-native';
import {LogBox} from 'react-native';
LogBox.ignoreAllLogs(true);

import StackNavigator from './StackNavigator';
import {AuthProvider} from './hooks/useAuth';

const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
