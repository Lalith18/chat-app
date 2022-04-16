
import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

import { auth, database } from '../../config/firebase';
import { query, onSnapshot, doc, getDoc, setDoc, collection, getDocs, orderBy, limit, Timestamp } from '@firebase/firestore';

import GroupTile from '../components/GroupTile';

const Groups = ({navigation}: {navigation: any}) => {
    const [groups, setGroups] = useState([]);

    const onJoin = (groupId: any) => {
        setDoc(doc(collection(database,`chat_group/${groupId}/group_members`),auth?.currentUser?.uid || ''),{
            location: 'Chennai',
            name: auth?.currentUser?.email || '',
            phone_number: '9876543210',
            role: 'help-seeker',
            lastSeen: Timestamp.fromDate(new Date())
        }).then(result => {
            console.log(result);
            navigation.navigate('Chat', {groupId: groupId})   
        })
    }

    useEffect(() => {
        const collectionRef = collection(database,'chat_group');
        const q = query(collectionRef);

        const unsubscribe = onSnapshot(q, (querySnapshot: any) => {
            const newGroups: any = [];
            querySnapshot.docs.forEach((d: any) => {
                const docRef = doc(database, `chat_group/${d.id}/group_members`, auth?.currentUser?.uid || '' )
                getDoc(docRef).then(doc => {
                    if (!doc.exists()) {
                        return newGroups.push({
                            _id: d.id,
                            groupName: d.data().group_name,
                            description: d.data().description
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
            {groups.map((group: any) => 
                <TouchableOpacity key={group._id} onPress={() => onJoin(group._id)}>
                    <View style={styles.container}>
                        <Text style={styles.title} >{group.groupName}</Text>
                        <Text style={styles.description} >{group.description}</Text>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      height: 80,
      borderBottomWidth: 1,
      borderBottomColor: 'grey',
      padding: 5,
      paddingLeft: 20
    },
    title: {
      fontSize: 25
    },
    description: {
      fontSize: 20
    }
  });

export default Groups;