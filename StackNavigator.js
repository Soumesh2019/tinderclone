/* eslint-disable prettier/prettier */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import useAuth from './hooks/useAuth';
import ModalScreen from './screens/ModalScreen';
import MatchScreen from './screens/MatchScreen';
const StackNavigator = () => {
  const Stack = createStackNavigator();
  const {user} = useAuth();

  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
      }}>
      {user ? (
        <>
          <Stack.Group>
            <Stack.Screen name="home" component={HomeScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{presentation: 'modal'}}>
            <Stack.Screen name="modal" component={ModalScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{presentation: 'transparentModal'}}>
            <Stack.Screen name="match" component={MatchScreen} />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen name="login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
