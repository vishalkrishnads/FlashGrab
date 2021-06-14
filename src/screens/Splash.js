import React from 'react';
import { View, Text, Animated, Easing, Dimensions, TouchableOpacity, Vibration } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDynamicStyleSheet } from 'react-native-dark-mode'
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import FingerprintScanner from 'react-native-fingerprint-scanner'
import DeleteIcon from 'react-native-vector-icons/Feather'
import EnterIcon from 'react-native-vector-icons/Ionicons'
import dynamicStyles from '../assets/styles/Splash'
import LoadingAnimation from '../assets/misc/animation';

const Splash = ({ navigation }) => {
    const height = Dimensions.get('window').height
    const width = Dimensions.get('window').width
    const styles = useDynamicStyleSheet(dynamicStyles)
    const fadeAnim = React.useRef(new Animated.Value(1)).current;
    const top_screen = React.useRef(new Animated.Value(0)).current;
    const bottom_screen = React.useRef(new Animated.Value(height)).current;
    let [animated_flex, change_flex] = React.useState(19);
    let [pin, change_pin] = React.useState('');
    let [isfirsttime, setfirsttime] = React.useState(false);
    let [status, set_status] = React.useState('Enter PIN')

    React.useEffect(async () => {
        try {
            if (await AsyncStorage.getItem('@launched') !== null) {
                await EncryptedStorage.setItem("launched", 'true')
                AsyncStorage.removeItem('@launched')
            }
            if (await EncryptedStorage.getItem("launched") !== null) {
                if (await EncryptedStorage.getItem("fingerprint") !== null) {
                    animate()
                    FingerprintScanner
                        .authenticate({ title: 'Log into FlashGrab', description: "If fingerprint isn't working, use PIN. Don't waste time before a sale", cancelButton: "Use PIN" })
                        .then(() => {
                            securepass();
                        }).catch(async (error) => {
                            if (error.name === "FingerprintScannerNotEnrolled") {
                                await EncryptedStorage.removeItem("fingerprint");
                            }
                            scrollUp()
                        })
                }
                else if (await EncryptedStorage.getItem("pin") !== null) { animate(); setTimeout(() => scrollUp(), 1000) }
                else securepass()
            } else {
                setfirsttime(true)
            }
        } catch (e) { }
    }, [])

    const animate = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start(() => Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start(()=>animate()));
    }
    const scrollUp = () => {
        Animated.timing(top_screen, {
            toValue: -height,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.linear
        }).start(() => {
            change_flex(0)
            Animated.timing(bottom_screen, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
                easing: Easing.linear
            }).start()
        })
    };
    const securepass = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        });
        navigation.navigate("Home")
    }

    const check_pin = async () => {
        if (pin === await EncryptedStorage.getItem("pin")) securepass()
        else { Vibration.vibrate([50, 100, 50, 100]); set_status('Incorrect PIN'); change_pin('') }
    }

    const Button = ({ value }) => {
        return (
            <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                Vibration.vibrate(20)
                if (value == "OK") { check_pin() }
                else if (value == "Del") { change_pin(pin.slice(0, -1)) }
                else if (pin.length <= 3) {
                    change_pin(prev => prev + value)
                }
            }}
                onLongPress={() => { if (value === "Del") { Vibration.vibrate(50); change_pin('') } }}
            >
                {value === "OK" ? <EnterIcon name="md-enter-outline" style={[styles.keypad_number, { fontSize: width / 8, color: global.accent }]} /> : value === "Del" ? <DeleteIcon name="delete" style={styles.keypad_number} /> : <Text style={styles.keypad_number}>{value}</Text>}
            </TouchableOpacity >
        );
    }
    const Row = ({ values }) => {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Button value={values[0]} />
                <Button value={values[1]} />
                <Button value={values[2]} />
            </View>
        );
    }
    const PlaceHolder = ({ place }) => {
        return (
            <View style={styles.placeholder}>
                {pin.length + 1 <= place ? <Text style={styles.hash}>-</Text> : <Text style={styles.bullet}>&bull;</Text>}
            </View>
        );
    }
    return (
        <SafeAreaView style={styles.root}>
            <Animated.View style={{ flex: animated_flex, transform: [{ translateY: top_screen }] }}>
                <View style={{ flex: 2 }}></View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <LoadingAnimation opacity={fadeAnim} />
                </View>
                <View style={{ flex: 2 }}>
                    {isfirsttime ? <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={{ flex: 4 }}></View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}></View>
                            <TouchableOpacity style={styles.start_button} onPress={async () => {
                                await EncryptedStorage.setItem("launched", JSON.stringify(true))
                                if (await EncryptedStorage.getItem("pin") !== null) { animate(); scrollUp() }
                                else { securepass() }
                            }}>
                                <Text style={styles.start_text}>START</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1 }}></View>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', margin: 10, marginTop: 20 }}>
                            <Text style={styles.captions}>By clicking on START, you agree to</Text>
                            <Text style={styles.captions}>the terms of service & privacy policy</Text>
                        </View>
                    </View> : null}
                </View>
            </Animated.View>
            <Animated.View style={{ flex: 1, transform: [{ translateY: bottom_screen }] }}>
                <View style={{ flex: 2, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Text style={{ color: global.accent, fontFamily: 'Baloo-Bold', fontSize: width / 12 }}>{status}</Text>
                </View>
                <View style={{ flex: 3, alignItems: 'center', flexDirection: 'row', marginLeft: 10, marginRight: 10 }}>
                    <PlaceHolder place={1} />
                    <PlaceHolder place={2} />
                    <PlaceHolder place={3} />
                    <PlaceHolder place={4} />
                </View>
                <View style={{ flex: 6 }}>
                    <Row values={['1', '2', '3']} />
                    <Row values={['4', '5', '6']} />
                    <Row values={['7', '8', '9']} />
                    <Row values={["Del", '0', "OK"]} />
                </View>
            </Animated.View>
        </SafeAreaView >
    );
}

export default Splash