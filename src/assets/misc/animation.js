import React from 'react'
import { Animated, View } from 'react-native'
import { useDarkMode } from 'react-native-dark-mode'
import styles from '../styles/animation'

const LoadingAnimation = ({ opacity }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Animated.Image
                source={useDarkMode() ? require('../img/dark.png') : require('../img/light.png')}
                style={[styles.logo, { opacity: opacity }]}
            />
        </View>
    )
}

export default LoadingAnimation