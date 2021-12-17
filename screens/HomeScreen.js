/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

import {useNavigation} from '@react-navigation/core';
import React, {useRef, useEffect, useState} from 'react';
import {View, SafeAreaView, Image, StyleSheet, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Swiper from 'react-native-deck-swiper';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ref, onValue, get, child, update} from 'firebase/database';
import {database} from '../firebaseConfig';

import useAuth from '../hooks/useAuth';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {logOut, user} = useAuth();
  const [profiles, setprofiles] = useState([]);
  const swiperRef = useRef(null);

  useEffect(() => {
    const unsub = onValue(ref(database, 'users/' + user.uid), snapshot => {
      if (!snapshot.exists()) {
        navigation.navigate('modal');
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const dbRef = ref(database);
    let unsub;

    const fetchProfiles = async () => {
      const profileArray = [];
      const passArray = [];
      const swipesArray = [];

      onValue(ref(database, 'users/' + user.uid + '/passes/'), snapshot => {
        snapshot.forEach(doc => {
          passArray.push(doc.val().id);
        });
      });

      onValue(ref(database, 'users/' + user.uid + '/swipes/'), snapshot => {
        snapshot.forEach(doc => {
          swipesArray.push(doc.val().id);
        });
      });

      unsub = await get(child(dbRef, 'users'))
        .then(snapshot => {
          if (snapshot.exists()) {
            snapshot.forEach(doc => {
              const obj = {key: doc.key, profile: doc.val()};
              profileArray.push(obj);
            });
          } else {
            console.log('No data available');
          }
        })
        .catch(error => {
          console.error(error);
        });

      [...passArray, ...swipesArray].forEach(id => {
        profileArray.filter(elem => id !== elem.profile.passes.key);
      });

      setprofiles(profileArray.filter(profile => profile.key !== user.uid));
    };

    fetchProfiles();
    return unsub;
  }, []);

  const swipeLeft = async cardIndex => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    const updates = {};

    updates['users/' + user.uid + '/passes/' + userSwiped.key] =
      userSwiped.profile;

    update(ref(database), updates);
  };

  const swipeRight = async cardIndex => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    const updates = {};

    updates['users/' + user.uid + '/swipes/' + userSwiped.key] =
      userSwiped.profile;

    update(ref(database), updates).then(() => {
      onValue(ref(database, `users/${user.uid}`), snapshot => {
        if (snapshot.exists()) {
          const userDetails = snapshot.val();

          onValue(
            ref(database, `users/${userSwiped.key}/swipes/${user.uid}`),
            Swipedsnapshot => {
              if (Swipedsnapshot.exists()) {
                console.log('Match Found');

                onValue(
                  ref(database, `users/${userSwiped.key}`),
                  SwipedUserSnapshot => {
                    const SwipedUser = SwipedUserSnapshot.val();

                    navigation.navigate('match', {userDetails, SwipedUser});
                  },
                );
              } else {
                console.log('Match Not Found');
              }
            },
          );
        } else {
          console.log('Data Not Found');
        }
      });
    });
  };

  return (
    <SafeAreaView style={{flex: 1, flexDirection: 'column'}}>
      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity onPress={logOut}>
          {user && (
            <Image source={{uri: user.photoURL}} style={styles.profilePic} />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('modal')}>
          <Image
            resizeMode="contain"
            source={require('../assets/logo.png')}
            style={{height: 70, width: 70}}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => navigation.navigate('chats')}>
          <Icon name="wechat" size={50} color="#fe3c72" />
        </TouchableOpacity> */}
      </View>
      {/* End of Header */}

      {/* Cards */}

      <View style={styles.cardContainer}>
        <Swiper
          cards={profiles}
          ref={swiperRef}
          showSecondCard
          stackSize={3}
          backgroundColor="transparent"
          keyExtractor={card => card && card.key}
          horizontalSwipe={true}
          onSwipedLeft={cardIndex => swipeLeft(cardIndex)}
          onSwipedRight={cardIndex => swipeRight(cardIndex)}
          verticalSwipe={false}
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: {
                  textAlign: 'left',
                  color: 'red',
                },
              },
            },
            right: {
              title: 'MATCH',
              style: {
                label: {
                  color: '#4DED30',
                },
              },
            },
          }}
          renderCard={card =>
            card ? (
              <View style={styles.card}>
                <Image
                  resizeMode="cover"
                  style={styles.image}
                  source={{uri: card.profile.profilePic}}
                />
                <View style={styles.details}>
                  <View>
                    <Text style={{fontWeight: 'bold', ...styles.text}}>
                      {card.profile.displayName}
                    </Text>
                    <Text style={{fontSize: 18, ...styles.text}}>
                      {card.profile.job}
                    </Text>
                  </View>
                  <Text style={{fontWeight: 'bold', ...styles.text}}>
                    {card.profile.age}
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={{
                  margin: 30,
                  borderRadius: 20,
                  position: 'relative',
                  backgroundColor: 'white',
                  height: '50%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: 3,
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 20, color: 'gray'}}>
                  No More Profiles
                </Text>

                <Image
                  resizeMode="contain"
                  style={{height: '20%', width: '100%'}}
                  source={{uri: 'https://links.papareact.com/6gb'}}
                />
              </View>
            )
          }
        />
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button}>
          <Entypo name="cross" size={28} color="red" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{...styles.button, backgroundColor: 'rgba(0,255,0,0.6)'}}>
          <AntDesign name="heart" size={28} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(255,0,0,0.6)',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },

  buttons: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
  },

  cardContainer: {
    flex: 1,
    marginTop: -50,
    zIndex: -2,
  },

  card: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    height: '85%',
    width: '100%',
    zIndex: -2,
  },

  details: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
    elevation: 1,
    backgroundColor: 'white',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },

  image: {
    height: '80%',
    width: '100%',
    overflow: 'hidden',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  header: {
    marginTop: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  profilePic: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },

  text: {
    color: 'black',
    fontSize: 23,
  },
});

export default HomeScreen;
