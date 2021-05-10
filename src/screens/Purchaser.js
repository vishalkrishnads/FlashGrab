import React from 'react'
import { View, Text, Animated, Easing } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDynamicStyleSheet } from 'react-native-dark-mode'
import ProgressCircleSnail from 'react-native-progress/CircleSnail'
import MarqueeText from 'react-native-marquee';
import dynamicStyles from '../assets/styles/Purchaser'
import LoadingAnimation from '../assets/misc/animation'

const Purchase_Engine = () => {
    const styles = useDynamicStyleSheet(dynamicStyles)
    const fadeAnim = React.useRef(new Animated.Value(1)).current;
    const container = React.useRef(new Animated.Value(0)).current;
    let [log, update_log] = React.useState([])
    let [display, set_display] = React.useState([])
    const opacities = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 1]
    const animate = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true
        }).start(() => Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
        }).start(() => animate()));
    }

    const onMessage = (message) => {
        var temp = log
        temp.push(message)
        update_log(temp)
        Animated.timing(container, {
            toValue: 20,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.bounce
        }).start(() => {
            temp = log.slice(Math.max(log.length - 5, 1))
            set_display(temp)
            Animated.timing(container, {
                toValue: -0,
                duration: 500,
                useNativeDriver: true,
                easing: Easing.bounce
            }).start()
        });
    };
    return (
        <SafeAreaView style={styles.root}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.heading}>Purchase Engine</Text>
            </View>
            <View style={{ flex: 8 }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingAnimation opacity={fadeAnim} />
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 2 }}>
                        <View style={{ flex: 1 }}></View>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ProgressCircleSnail color={global.accent} />
                        </View>
                    </View>
                    <View style={styles.text_container}>
                        {display.map((message, index) =>
                            <Animated.View style={{ transform: [{ translateY: container }] }}>
                                <MarqueeText
                                    style={[styles.text, { opacity: opacities[index] }]}
                                    duration={3000}
                                    marqueeOnStart
                                    loop
                                    marqueeDelay={1000}
                                    marqueeResetDelay={3000}
                                >{message}</MarqueeText>
                            </Animated.View>
                        )}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Purchase_Engine