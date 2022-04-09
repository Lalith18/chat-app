import React, {useLayoutEffect, useState, useEffect} from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Image} from 'react-native';
import { signOut } from '@firebase/auth';
import { auth, database } from '../../config/firebase';

import { query, onSnapshot, doc, getDoc, collection, orderBy, limit, Timestamp } from '@firebase/firestore';



import GroupTile from '../components/GroupTile';
import { getDocs, updateDoc, where} from 'firebase/firestore';

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
                      const lastSeen = doc.data().lastSeen.toDate()
                      const collectionlRef = collection(database, `chat_group/${d.id}/messages`)
                      const ql = query(collectionlRef, where('createdAt', '>', lastSeen))
                      getDocs(ql).then((snapshot: any) => {
                        let total_count = 0;
                        snapshot.forEach((doc: any) => {
                            total_count += 1;
                        });
                        const grp = { count: total_count}
                        return grp
                      })
                      .then((grp) => {
                        const collectionRef = collection(database, `chat_group/${d.id}/messages`)
                        const q = query(collectionRef, orderBy('createdAt', 'desc'),limit(1))
                        return getDocs(q).then(snap => {
                          snap.forEach(msg => {
                            return newGroups.push({
                              ...grp,
                              _id: d.id,
                              groupName: d.data().group_name,
                              lastMsg: msg.data().text,
                              lastMsgTime: msg.data().createdAt.toDate()
                            })
                          })
                        })
                      })
                      .then(grpdata => {
                        setGroups(newGroups.map((grpdata:any) => grpdata))
                      })
                      .catch(err => {
                        console.log(err)
                      })
                    }
                })
            })
        });

        return () => unsubscribe();
      }, []);

      const getCount = (lastSeen: any, groupId: String) => {
        const collectionRef = collection(database, `chat_group/${groupId}/messages`)
        const q = query(collectionRef, where('createdAt', '>', lastSeen))
        return getDocs(q).then((snapshot: any) => {
          let total_count = 0;
          snapshot.forEach((doc: any) => {
              total_count += 1;
          });
  
          console.log(total_count)
      });
      }

    return(
      <View>
          {groups.map((group: any) => <GroupTile key={group._id} onPress={() => {navigation.navigate('Chat', {groupId: group._id})}} group={group}/>)}
      </View>
    )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 100,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5
  },
  img: {
    height: '90%',
    aspectRatio: 1,
    borderRadius: 50
  },
  details : {
    marginLeft: 25,
    height: '100%',
  },
  title: {
    fontSize: 25
  },
  description: {
    fontSize: 20
  }
});

export default Home;