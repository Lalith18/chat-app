import React, {useLayoutEffect, useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { signOut } from '@firebase/auth';
import { auth, database } from '../../config/firebase';
import { query, onSnapshot, doc, getDoc, collection, orderBy, limit, collectionGroup, deleteDoc, getDocs, where } from '@firebase/firestore';
import GroupTile from '../components/GroupTile';

const Home = ({navigation}: {navigation: any}) => {
    
    const [groups, setGroups] = useState<any[]>([])
    const [selectMode, setSelectMode] = useState(false)

    const onLongPress = (groupId: any) => {
      setSelectMode(true)

      const newGroups =  groups.map((group) => {
        if(group._id === groupId) {
          return {...group, selected: !group.selected}
        }
        return group
      })

      setGroups(newGroups.map(group => group))

      const selectedGroups = newGroups.filter(group => group.selected === true)
      if (selectedGroups.length === 0) {
        setSelectMode(false)
      }
    }

    const compare = (a: any,b: any) => {
      if(a.lastMsgTime && b.lastMsgTime) {
        return b.lastMsgTime - a.lastMsgTime
      } else if (a.lastMsgTime) {
        return 1
      } else {
        return -1
      }
    } 
    const onSignOut = () => {
        signOut(auth).catch(error => console.log('Error logging out: ', error));
      };

    const unselectAll = () => {
      setSelectMode(false)
      setGroups(groups.map(group => {
        return {...group, selected: false}
      }))
    }

    const deleteGroups = () => {
      let filteredGroups = groups
      groups.forEach(group => {
        if(group.selected) {
          const groupId = group._id
          deleteDoc(doc(database,'chat_group',groupId,'group_members',auth?.currentUser?.uid || ''))
          filteredGroups = filteredGroups.filter(group => group._id !== groupId)
        }
      })
      setGroups(filteredGroups.map(group => group))
      setSelectMode(false)
    }

    const generalHeaderOptions = {
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
    }

    const selectHeaderOptions = {
      headerLeft: () => (
        <TouchableOpacity
          style={{
            marginLeft: 10
          }}
          onPress={unselectAll}
        >
          <Text>Back</Text>
        </TouchableOpacity>
        
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 10
          }}
          onPress={deleteGroups}
        >
          <Text>Delete Groups</Text>
        </TouchableOpacity>
        
      )
    }

    useLayoutEffect(() => {
        navigation.setOptions( selectMode ? selectHeaderOptions : generalHeaderOptions);
      }, [navigation, selectMode, groups]);

      useEffect(() => {
        const qm = query(collectionGroup(database, 'messages'))
        const unsubscriber = onSnapshot(qm, (m: any) => {
          const collectionRef = collection(database,'chat_group');
          const q = query(collectionRef)
          onSnapshot(q, (querySnapshot: any) => {
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
                        const grp = { count: total_count, selected: false}
                        return grp
                      })
                      .then((grp) => {
                        const collectionRef = collection(database, `chat_group/${d.id}/messages`)
                        const q = query(collectionRef, orderBy('createdAt', 'desc'),limit(1))
                        return getDocs(q).then(snap => {
                          if(snap.docs.length === 0) {
                            return newGroups.push({
                              ...grp,
                              _id: d.id,
                              groupName: d.data().group_name
                            })
                          } else {
                            snap.forEach(msg => {
                              return newGroups.push({
                                ...grp,
                                _id: d.id,
                                groupName: d.data().group_name,
                                lastMsg: msg.data().text,
                                lastMsgTime: msg.data().createdAt.toDate()
                              })
                            })
                          }
                        })
                      })
                      .then(grpdata => {
                        newGroups.sort(compare)
                        setGroups(newGroups.map((grpdata:any) => grpdata))
                        
                      })
                      .catch(err => {
                        console.log(err)
                      })
                    }
                })
            })
          })
        })
        return () => unsubscriber();
      }, []);

    return(
      <View>
          {groups.map((group: any) => <GroupTile key={group._id} onPress={() => navigation.navigate('Chat', {groupId: group._id})} group={group} selectMode={selectMode} onLongPress={onLongPress} />)}
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