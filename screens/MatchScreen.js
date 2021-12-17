/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */

import {useNavigation, useRoute} from '@react-navigation/core';
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

const MatchScreen = () => {
  const navigation = useNavigation();
  const {params} = useRoute();

  const {userDetails, SwipedUser} = params;

  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: 'space-evenly',
          alignItems: 'center',
          padding: 20,
          flex: 1,
        }}>
        <Image
          source={require('../assets/match.jpg')}
          style={styles.headImage}
          resizeMode="contain"
        />
        <Text
          style={{
            fontSize: 15,
            fontStyle: 'italic',
            color: 'white',
            textAlign: 'center',
          }}>
          You and {SwipedUser.displayName} have liked each other
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            flex: 1,
            marginTop: 30,
            width: '100%',
          }}>
          <Image
            source={{uri: SwipedUser.profilePic}}
            style={{height: 100, width: 100, borderRadius: 50}}
          />
          <Image
            source={{uri: userDetails.profilePic}}
            style={{height: 100, width: 100, borderRadius: 50}}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.goBack();
          }}>
          <Text
            style={{
              color: 'black',
              fontStyle: 'italic',
              textAlign: 'center',
            }}>
            Back to Swiping
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MatchScreen;

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 70,
    borderRadius: 90,
  },

  container: {
    height: '100%',
    backgroundColor: '#fe3c72',
    opacity: 0.89,
  },
  headImage: {
    height: '30%',
    width: '100%',
  },
});
