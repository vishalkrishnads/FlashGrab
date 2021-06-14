import React from 'react'
import { View, Text, Animated, Modal, TouchableWithoutFeedback, Image, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDarkMode, useDynamicStyleSheet } from 'react-native-dark-mode'
import { OutlinedTextField } from 'react-native-material-textfield'
import dynamicStyles from '../assets/styles/Purchaser'
import AdView from '../assets/misc/AdView'
import { KEYS } from '@env'

var CryptoJS = require("crypto-js");
const Purchase_Engine = ({ navigation, route }) => {
    const { data } = route.params
    const socket = new WebSocket('ws://localhost:3000');
    const isDarkMode = useDarkMode()
    const styles = useDynamicStyleSheet(dynamicStyles)
    const opacity = React.useRef(new Animated.Value(1)).current;
    let [log, update_log] = React.useState([])
    let [display, set_display] = React.useState('')
    let [visibility, set_visibility] = React.useState(false)
    let [title, set_title] = React.useState('')
    let [instruction, set_instruction] = React.useState('')
    let [placeholder, set_placeholder] = React.useState('')
    let [image, set_image] = React.useState('')
    let [input, set_input] = React.useState('')
    let [error, set_error] = React.useState('')
    const decrypt = (cipher) => {
        try {
            var bytes = CryptoJS.AES.decrypt(cipher, KEYS)
            return bytes.toString(CryptoJS.enc.Utf8)
        } catch {
            return cipher
        }
    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            socket.onopen = () => {
                socket.send(CryptoJS.AES.encrypt(JSON.stringify({
                    "url": data.url,
                    "username": decrypt(data.username), // decrypt from local storage
                    "password": decrypt(data.password),
                    "payment_method": data.payment_method,
                    "payment_data": decrypt(data.payment_data),
                    "pin_code": data.pin_code,
                    "seller": data.seller
                }), KEYS).toString())
            }
            socket.onmessage = (data) => {
                const message = JSON.parse(data.data)
                if (message.intermediate) {
                    set_title(message.intermediate_data.title)
                    set_instruction(message.intermediate_data.instruction)
                    set_placeholder(message.intermediate_data.placeholder)
                    if (message.intermediate_data.image) set_image(message.intermediate_data.image)
                    set_visibility(true)
                }
                else add_message(message)
            }
            socket.onclose = () => setTimeout(() => navigation.goBack(), 3000)
            return unsubscribe;
        }, [navigation, socket]);
    });

    React.useEffect(() =>
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            if (socket.readyState === WebSocket.CLOSED) {
                navigation.dispatch(e.data.action)
            } else {
                Alert.alert(
                    'Quit Purchase?',
                    'Your purchase is still going on at our server. Do you want to quit?',
                    [
                        { text: 'Cancel', style: 'cancel', onPress: () => { } },
                        {
                            text: 'Quit Purchase',
                            style: 'destructive',
                            onPress: () => { socket.send(`close`) },
                        },
                    ]
                );
            }
        })
        ,
        [navigation]
    );

    const send_intermediate = () => {
        if (!input) set_error(`Please enter the required value`)
        else {
            set_error('')
            socket.send(CryptoJS.AES.encrypt(JSON.stringify({
                "intermediate": true,
                "intermediate_data": input
            }), KEYS).toString())
            set_visibility(false)
        }
    }

    const add_message = (message) => {
        console.log(`Message coming into add_message() is ${message.message}`)
        var temp = log
        temp.push(message)
        update_log(temp)
        Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start(() => {
            set_display(message.message)
            Animated.timing(opacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }).start()
        });
    };
    return (
        <SafeAreaView style={styles.root}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.heading}>Purchase Engine</Text>
            </View>
            <Modal
                transparent={true}
                animationType={'fade'}
                visible={visibility}
                statusBarTranslucent={true}>
                <View style={styles.modal}>
                    <View style={styles.selector_root}>
                        <View style={{ flex: 1.5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={[styles.selector_heading, { color: global.accent }]}>{title}</Text>
                        </View>
                        <View style={styles.field_container}>
                            <View style={{ flex: image ? 1 : 0, alignItems: 'center' }}>
                                <Image
                                    source={{ uri: image }}
                                    style={styles.captcha}
                                />
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <OutlinedTextField
                                    label={placeholder}
                                    onChangeText={input => set_input(input)}
                                    onSubmitEditing={send_intermediate}
                                    tintColor={global.accent}
                                    returnKeyType="next"
                                    textColor={isDarkMode ? "white" : "black"}
                                    baseColor={isDarkMode ? "#f2f2f2" : "black"}
                                    error={error}
                                />
                                <Text style={styles.instruction}>{instruction}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
                            <View style={{ flex: 5 }}></View>
                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                <TouchableWithoutFeedback onPress={() => { socket.send(`close`); socket.send(`close`); set_visibility(false) }}>
                                    <View style={styles.button}>
                                        <Text style={[styles.button_text, { color: global.accent }]}>CANCEL</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => send_intermediate()}>
                                    <View style={styles.button}>
                                        <Text style={[styles.button_text, { color: global.accent }]}>OK</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={{ flex: 1 }}></View>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={{ flex: 8 }}>
                <View style={styles.gallery}><AdView media={true} /></View>
                <View style={{ flex: 5 }}>
                    <View style={{ flex: 2 }}></View>
                    <View style={styles.text_container}>
                        <Animated.Text style={[styles.text, { opacity: opacity }]}>
                            {display}
                        </Animated.Text>
                    </View>
                </View>
            </View>
        </SafeAreaView >
    );
}

export default Purchase_Engine