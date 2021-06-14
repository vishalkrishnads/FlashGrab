import React from 'react'
import { View, Text } from 'react-native'
import { useDynamicStyleSheet } from 'react-native-dark-mode'
import { SafeAreaView } from 'react-native-safe-area-context'
import dynamicStyles from '../assets/styles/Migrator'

const Migrator = () => {
    const styles = useDynamicStyleSheet(dynamicStyles)
    return(
        <SafeAreaView style={styles.root}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.heading}>Transferring Sales</Text>
            </View>
            <View style={{flex: 8}}></View>
        </SafeAreaView>
    );
}

export default Migrator;