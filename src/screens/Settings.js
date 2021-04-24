import React from 'react'
import { View, Text } from 'react-native'
import { useDynamicStyleSheet } from 'react-native-dark-mode'
import { SafeAreaView } from 'react-native-safe-area-context'
import dynamicStyles from '../assets/styles/Settings'

const Settings = ({ navigation }) => {
    const styles = useDynamicStyleSheet(dynamicStyles)
    return (
        <SafeAreaView style={styles.root}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.heading}>Settings</Text>
            </View>
            <View style={{ flex: 8 }}></View>
        </SafeAreaView>
    );
}

export default Settings