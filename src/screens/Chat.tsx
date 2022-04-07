import React, {
  useState,
  useEffect,
  useCallback
} from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot
} from 'firebase/firestore';

import { updateDoc, doc, Timestamp } from '@firebase/firestore';

import { auth, database } from '../../config/firebase';

const Chat = ({navigation, route}: {navigation: any, route: any}) => {
  const [messages, setMessages] = useState([]);

  const { groupId} = route.params

  const updateLastSeen = (groupId: any) => {
    return updateDoc(doc(database,`chat_group/${groupId}/group_members`,auth?.currentUser?.uid || ''), {
      lastSeen: Timestamp.fromDate(new Date())
    })
  }

  useEffect(() => {
    const collectionRef = collection(database, `chat_group/${groupId}/messages`);
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot: any) => {
      updateLastSeen(groupId).then(() => {
        setMessages(
          querySnapshot.docs.map((doc: any)  => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user
          }))
        );
      })
    });

    return () => unsubscribe();
  }, []);


const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];    
    addDoc(collection(database, `chat_group/${groupId}/messages`), {
      _id,
      createdAt,
      text,
      user
    });
  }, []);

  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={messages => onSend(messages)}
      renderUsernameOnMessage={true}
      user={{
        _id: auth?.currentUser?.email || '',
        avatar: 'https://i.pravatar.cc/300',
        name: auth?.currentUser?.email || '',
      }}
    />
  )
}

export default Chat;