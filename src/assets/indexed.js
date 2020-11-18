import React from 'react';
import {View, Text} from 'react-native';
import {DynamicValue, DynamicStyleSheet, useDynamicStyleSheet} from 'react-native-dark-mode';

const Indexed=({index, text})=>{
    const styles = useDynamicStyleSheet(DynamicStyles);
    return(
           <View style={styles.indexed}>
                <View style={styles.index}>
                    <Text style={styles.text}>{index}</Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.text}>{text}</Text>
                </View>
            </View>
        );
}

const DynamicStyles = new DynamicStyleSheet({
    indexed:{
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 20,
        marginRight: 10
    },
    index:{
        flex: 1
    },
    content:{
        flex: 10
    },
    text:{
        fontSize: 15,
        color: new DynamicValue('black', 'white')
    }
})

export default Indexed;