import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

const GroupTile = ({group, onPress, selectMode, onLongPress}:{group: any, onPress: any, selectMode: boolean, onLongPress: any}) => {

    const longPressed = () => {
      onLongPress(group._id)
    } 
    return(
        <TouchableOpacity onPress={selectMode ? longPressed : onPress} onLongPress={longPressed}>
            <View style={styles.container}>
              <View>
                <Image
                style={styles.img}
                source={{
                    uri: 'https://i.pravatar.cc/300',
                }}
                />
                {group.selected && <View style={styles.selected} />}
              </View>
                <View style={styles.details}>
                  <View style={styles.subDetails}> 
                    <Text style={styles.title} numberOfLines={1}>{group.groupName}</Text>
                    {
                      group.lastMsg &&
                      <Text style={styles.time} >
                        {group.lastMsgTime.getHours() > 12 ? (group.lastMsgTime.getHours()%12) + ":" + group.lastMsgTime.getMinutes() + " PM" : group.lastMsgTime.getHours() + ":" + group.lastMsgTime.getMinutes() + " AM"}
                      </Text>
                    }
                  </View>
                  {group.lastMsg && <Text style={styles.description} >{group.lastMsg}</Text>}
                </View>
                {group.count && group.count > 0 ?
                  <View style={styles.countBubble}>
                    <Text style={styles.count}>{group.count}</Text>
                  </View>
                  : <View></View>
                }
            </View>
        </TouchableOpacity>
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
    selected: {
      height: 30,
      width: 30,
      borderRadius: 50,
      backgroundColor: 'lightgreen',
      position: 'absolute',
      bottom: 0,
      right: 0
    },
    img: {
      height: '90%',
      aspectRatio: 1,
      borderRadius: 50
    },
    details : {
      marginLeft: 25,
      height: '100%',
      width: '70%',
    },
    title: {
      fontSize: 25
    },
    description: {
      fontSize: 20
    },
    countBubble: {
      height: 30,
      width: 30,
      borderRadius: 50,
      backgroundColor: 'green',
      color: 'white',
      position: 'absolute',
      right: 10
    },
    count: {
      color: 'white',
      fontSize: 20,
      textAlign: 'center',
    },
    subDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    time: {
      color: 'grey',
      fontSize: 16,
    }
  });

export default GroupTile