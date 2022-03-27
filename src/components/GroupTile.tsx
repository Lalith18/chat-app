import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';

const GroupTile = ({group, onPress}:{group: any, onPress: any}) => {
    return(
        <TouchableOpacity onPress={onPress}>
            <View style={styles.container}>
                <Image
                style={styles.img}
                source={{
                    uri: 'https://i.pravatar.cc/300',
                }}
                />
                <View style={styles.details}>
                    <Text style={styles.title} numberOfLines={1}>{group.groupName}</Text>
                    <Text style={styles.description} >{group.description}</Text>
                </View>
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

export default GroupTile