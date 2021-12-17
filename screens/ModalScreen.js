/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import {useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
import {Image, StyleSheet, Text, TextInput, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {database} from '../firebaseConfig';
import useAuth from '../hooks/useAuth';
import {ref, set, serverTimestamp} from 'firebase/database';

const ModalScreen = () => {
  const {user} = useAuth();
  const navigation = useNavigation();
  const [profilePic, setprofilePic] = useState('');
  const [job, setjob] = useState('');
  const [loading, setloading] = useState(false);
  const [age, setage] = useState('');

  const formNotComplete = !profilePic || !job || !age;

  const updateUserProfile = () => {
    setloading(true);

    set(ref(database, 'users/' + user.uid), {
      id: user.uid,
      displayName: user.displayName,
      profilePic: profilePic,
      job: job,
      age: age,
      timeStamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate('home');
      })
      .catch(err => console.log(err))
      .finally(() => setloading(false));
  };

  return (
    <View style={styles.modal}>
      <Image
        source={require('../assets/tinderBack.png')}
        resizeMode="contain"
        style={{height: '20%', width: '100%'}}
      />
      <Text style={styles.text}>Welcome, {user.displayName}</Text>

      <Text style={styles.step}>Step 1: The Profile Pic</Text>
      <TextInput
        placeholder="Enter a Profile Pic URL"
        style={{fontSize: 20, padding: 2, color: 'black'}}
        placeholderTextColor="gray"
        textAlign="center"
        keyboardType="url"
        value={profilePic}
        onChangeText={setprofilePic}
      />

      <Text style={styles.step}>Step 2: The Job</Text>
      <TextInput
        placeholder="Enter Your Occupation"
        style={{fontSize: 20, padding: 2, color: 'black'}}
        placeholderTextColor="gray"
        textAlign="center"
        keyboardType="default"
        value={job}
        onChangeText={setjob}
      />

      <Text style={styles.step}>Step 3: The Age</Text>
      <TextInput
        placeholder="Enter Your Age"
        style={{fontSize: 20, padding: 2, color: 'black'}}
        placeholderTextColor="gray"
        textAlign="center"
        value={age}
        keyboardType="numeric"
        maxLength={2}
        onChangeText={setage}
      />

      <TouchableOpacity
        onPress={() => updateUserProfile()}
        style={{marginTop: 10}}
        disabled={formNotComplete}>
        <Text
          style={{
            ...styles.button,
            backgroundColor: !formNotComplete ? '#fe3c72' : 'gray',
          }}>
          Update Profile
        </Text>
      </TouchableOpacity>
      {loading && <Text style={styles.text}>Uploading...</Text>}
    </View>
  );
};

export default ModalScreen;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    width: 300,
    textAlign: 'center',
    color: 'white',
    borderRadius: 10,
    fontSize: 20,
  },

  modal: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 1,
  },

  step: {
    textAlign: 'center',
    paddingTop: 30,
    fontWeight: 'bold',
    color: '#fe3c72',
    fontSize: 25,
  },
  text: {
    color: 'gray',
    fontSize: 24,

    fontWeight: 'bold',
    fontStyle: 'italic',
  },
});
