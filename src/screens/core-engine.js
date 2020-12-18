import * as React from 'react';
import { View, Text, Image, Alert, Keyboard, Modal, Vibration, BackHandler } from 'react-native';
import { DynamicStyleSheet, useDynamicStyleSheet, useDarkMode } from 'react-native-dark-mode';
import ProgressBar from 'react-native-progress/Bar';
import { Button } from 'react-native-elements';
import { TextField } from 'react-native-material-textfield';
import KeepAwake from 'react-native-keep-awake';
import styles from '../assets/styles';

function buy({ route, navigation }) {
    var socket = new WebSocket('ws://localhost:5000');
    const style = useDynamicStyleSheet(new DynamicStyleSheet(styles));
    let [status, setStatus] = React.useState("Connecting to server");
    let [seeker, showSeeker] = React.useState(false);
    global.connection = true;
    var hasconnected = false;
    let [otp, setOTP] = React.useState('');
    let [error, setError] = React.useState('');
    const { url } = route.params;
    const { username } = route.params;
    const { password } = route.params;
    const { seller } = route.params;
    const { pin } = route.params;
    const { cvv } = route.params;
    const isDarkMode = useDarkMode();
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', (e) => {
            socket.onopen = () => {
                hasconnected = true;
                socket.send(JSON.stringify({ 'otp': 'any', 'url': url, 'username': username, 'password': password, 'seller': seller, 'pin': pin, 'cvv': cvv }));
            }
            socket.onmessage = (d) => {
                setStatus(d.data);
                console.log(d.data);
                if (d.data === " ") {
                    return;
                }
                else if (d.data === "OTP") {
                    showSeeker(true);
                }
            }
            socket.onerror = (event) => {
                console.error(event);
            }
            socket.onclose = () => {
                setStatus("Connection was closed");
                global.connection = false;
                navigation.goBack();
                return unsubscribe;
            }
            return unsubscribe;
        }, [navigation, socket]);
    });
    React.useEffect(() =>
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            if (global.connection === false) {
                if (!hasconnected) {
                    navigation.dispatch(e.data.action);
                    return;
                }
                Alert.alert(
                    'Leave purchase engine?',
                    'Your purchase has either succeeded or failed. We cannot be certain of the outcome at this time. You can check ' + seller + "'s app/website for order details.",
                    [
                        {
                            text: 'Okay leave',
                            style: 'destructive',
                            onPress: () => {navigation.dispatch(e.data.action);},
                        },
                    ]
                );
            } else {
                Alert.alert(
                    'Quit Purchase?',
                    'Your purchase is still going on at our server. Do you want to quit?',
                    [
                        { text: 'Cancel', style: 'cancel', onPress: () => { } },
                        {
                            text: 'Quit Purchase',
                            style: 'destructive',
                            onPress: () => {socket.close(1000); BackHandler.exitApp()},
                        },
                    ]
                );
            }
        }),
        [navigation, socket]
    );
    const cancelOTP = () => {
        Keyboard.dismiss();
        showSeeker(false);
        setStatus("Payment cancelled");
        socket.close(1000, "User quit the sale");
    }
    const sendOTP = () => {
        if (!otp) {
            setError("Enter the OTP")
            Vibration.vibrate([100, 100, 100, 100])
            return
        }
        Keyboard.dismiss();
        showSeeker(false);
        setStatus("OTP sent to server");
        socket.send(JSON.stringify({ 'seller': seller, 'otp': otp }));
        setTimeout(() => {
            setStatus("Check " + seller + " app/website for order details")
        }, 2000)
        socket.close(1000, "Sale has finished");
    }
    return (
        <View style={style.root}>
            <KeepAwake />
            <View style={[style.container, { marginTop: 100 }]}>
                <Image
                    style={style.image}
                    source={require('../assets/img/logo.png')}
                />
                <ProgressBar width={250} style={{ marginTop: 50 }} height={4} indeterminate={true} borderRadius={0} useNativeDriver={true} borderWidth={0} color={global.accent} />
                <Text style={style.text}>{status}</Text>
            </View>
            <Modal
                onRequestClose={cancelOTP}
                animationType='slide'
                transparent={true}
                visible={seeker}>
                <View style={style.modal}>
                    <View style={style.pinseeker}>
                        <View style={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                            <Text style={{ color: isDarkMode ? "white" : "black", fontSize: 15 }} >I cannot detect invalid OTPs. If your OTP is wrong, this purchase will fail.</Text>
                        </View>
                        <View style={{ marginLeft: 20, marginRight: 20, }}>
                            <TextField
                                label='Enter your OTP'
                                onChangeText={otp => setOTP(otp)}
                                maxLength={6}
                                keyboardType='number-pad'
                                tintColor={global.accent}
                                textColor={isDarkMode ? "white" : "black"}
                                baseColor={isDarkMode ? "#f2f2f2" : "black"}
                                error={error}
                            />
                        </View>
                        <View style={{ flexDirection: 'row-reverse' }}>
                            <Button title="OK" titleStyle={{ color: global.accent }} onPress={sendOTP} buttonStyle={style.button} />
                            <Button title="Cancel" titleStyle={{ color: global.accent }} onPress={cancelOTP} buttonStyle={style.button} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default buy;