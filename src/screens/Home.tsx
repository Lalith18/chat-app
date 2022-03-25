import React, {useLayoutEffect, useState, useEffect} from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { signOut } from '@firebase/auth';
import { auth, database } from '../../config/firebase';

import { query, onSnapshot, doc, getDoc, collection } from '@firebase/firestore';

const Home = ({navigation}: {navigation: any}) => {
    const [groups, setGroups] = useState([]);
    const onSignOut = () => {
        signOut(auth).catch(error => console.log('Error logging out: ', error));
      };

    useLayoutEffect(() => {
        navigation.setOptions({
          headerLeft: () => (
            <TouchableOpacity
              style={{
                marginLeft: 10
              }}
              onPress={() => {navigation.navigate('Groups')}}
            >
              <Text>Join a Group</Text>
            </TouchableOpacity>
            
          ),
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

      useEffect(() => {
        const collectionRef = collection(database,'chat_group');
        const q = query(collectionRef);

        const unsubscribe = onSnapshot(q, (querySnapshot: any) => {
            const newGroups: any = [];
            querySnapshot.docs.forEach((d: any) => {
                const docRef = doc(database, `chat_group/${d.id}/group_members`, auth?.currentUser?.uid || '' )
                getDoc(docRef).then(doc => {
                    if (doc.exists()) {
                        return newGroups.push({
                            _id: d.id,
                            groupName: d.data().group_name,
                            groupDescription: d.data().description
                        })
                    }
                })
                .then(d => {
                    setGroups(newGroups.map((d:any) => d))
                })
                .catch(err => {
                    console.log(err);
                    
                })
            })
        });

        return () => unsubscribe();
      }, []);

    return(
      <View>
          {groups.map((group: any) => <Button key={group._id} title={group.groupName} onPress={() => {navigation.navigate('Chat', {groupId: group._id})}}/>)}
      </View>
    )
}

export default Home;