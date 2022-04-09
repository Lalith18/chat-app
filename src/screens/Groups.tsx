
import React from 'react';
import { useState, useEffect } from 'react';
import { View, Button} from 'react-native';

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
                        const collectionRef = collection(database, `chat_group/${d.id}/messages`)
                      const q = query(collectionRef, orderBy('createdAt', 'desc'),limit(1))
                      return getDocs(q).then(snap => {
                        snap.forEach(msg => {
                          return newGroups.push({
                            _id: d.id,
                            groupName: d.data().group_name
                          })
                        })
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
            {groups.map((group: any) => <GroupTile key={group._id} group={group} onPress={() =>{onJoin(group._id)}}/>)}
        </View>
    )
}

export default Groups;