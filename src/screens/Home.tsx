import React, {useLayoutEffect} from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { signOut } from '@firebase/auth';
import { auth } from '../../config/firebase';

const Home = ({navigation}: {navigation: any}) => {

    const onSignOut = () => {
        signOut(auth).catch(error => console.log('Error logging out: ', error));
      };

    useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              style={{
                marginRight: 10
              }}
              onPress={onSignOut}
            >
              <Text>Logout</Text>
            </TouchableOpacity>
          )
        });
      }, [navigation]);

    return(
        <View>
            <Button title='chats' onPress={() => {navigation.navigate('Chat')}}/>
        </View>
    )
}

export default Home;