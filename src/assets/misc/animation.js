import React from 'react'
import { Animated, ImageBackground, Image } from 'react-native'
import styles from '../styles/animation'

const LoadingAnimation = ({ opacity }) => {
    return (
        <ImageBackground
            source={require('../img/background.png')}
            style={styles.background}
            imageStyle={styles.background_image}
        >
            <Animated.View style={{ flex: 1, justifyContent: 'center', opacity: opacity }}>
                <Image
                    source={require('../img/foreground.png')}
                    style={styles.foreground}
                />
            </Animated.View>
        </ImageBackground>
    )
}

export default LoadingAnimation