import * as React from 'react';
import { View, ScrollView, Text, TouchableNativeFeedback, Switch, Platform, Keyboard, Modal, Vibration } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { TextField } from 'react-native-material-textfield';
import { useDarkMode, DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../assets/styles'

//somehow, both react-native-config react-native-link don't seem to work.
//For now, we'll use two files, namely: Fingerprint.txt & lock.txt
//Presence of both files indicate that the respective locks have been enabled
//Whereas, lock.txt will store the PIN code within also 
//We have an open issue. Once this is fixed, will push an update. 

const applock = ({ navigation }) => {
    const isDarkMode = useDarkMode();
    let [fingerprint_status, setState] = React.useState(false);
    let [pin1, setpin1] = React.useState('');
    const PIN1 = React.useRef(null);
    let [pin2, setpin2] = React.useState("");
    let [pin, setPIN] = React.useState('');
    let [error, setError] = React.useState('');
    let [seeker, showSeeker] = React.useState(false);
    let [status, setStatus] = React.useState('');
    let [availability, setAvailable] = React.useState(true);

    //this function checks availability of fingerprint scanner and disables switch if necessary
    const Fingerprintcheck = (name) => {
        if (Platform.Version < 23) {
            setStatus("Fingerprint only supported in Android 6.0+");
            setTimeout(function () { setStatus("Use a PIN Lock"); }, 8000);
            setAvailable(false);
            return;
        }
        else if (name === "FingerprintScannerNotAvailable") {
            setStatus("Fingerprint scanner not available");
            setTimeout(function () { setStatus("You can still use PIN Lock"); }, 8000);
            setAvailable(false);
            return;
        } else if (name === "FingerprintScannerNotSupported") {
            setState("Device doesn't support fingerprint lock");
            setTimeout(function () { setStatus("You can use PIN Lock"); }, 8000);
            setAvailable(false);
            return;
        } else if (name === "FingerprintScannerNotEnrolled") {
            setStatus("Enable fingerprint lock in device settings");
            setTimeout(function () { setStatus("Or use PIN lock if you prefer"); }, 8000);
            setAvailable(false);
            return;
        } else if (name === "HardwareError") {
            setStatus("Fingerprint scanner Hardware Error");
            setTimeout(function () { setStatus("You can still set a PIN lock"); }, 8000);
            setAvailable(false);
            return;
        } else {
            setStatus("Fingerprint: An unknown error occured");
            setTimeout(function () { setStatus("You can still use a PIN lock"); }, 8000);
            setAvailable(false);
            return;
        }
    }

    //function sets the new PIN lock.
    const savePIN = async() => {
        Keyboard.dismiss();
        //run basic checks
        if (!pin1 || !pin2) {
            if (!pin1) {
                setError("Enter a PIN");
                Vibration.vibrate([100, 100, 100, 100])
                return;
            } if (!pin2) {
                setError("Confirm PIN")
                Vibration.vibrate([100, 100, 100, 100])
                return;
            }
        }
        if (pin1 !== pin2) {
            setError("PIN's don't match")
            return;
        }
        await AsyncStorage.setItem('@pin', pin2);
        setPIN(previousState => !previousState);
        showSeeker(false);
        setStatus("PIN Lock enabled");
    }

    //function runs on toggling the switch "PIN Lock"
    const PIN = async() => {
        if (pin === false) {
            showSeeker(true);
        } else if (pin === true) {
            await AsyncStorage.removeItem('@pin').then(async()=>{
                showSeeker(false);
                setPIN(previousState => !previousState);
                setStatus("All locks are currently disabled");
                //yes, you could call fingerprint() directly to switch it OFF
                //but some weird combinations actually switch it back ON if it's OFF
                //we can safely bet on this one though.
                if (fingerprint_status === true) {
                    setState(previousState => !previousState);
                    await AsyncStorage.removeItem('@fingerprint');
                }
            })
        }
    }

    //function runs on toggling the switch "Fingerprint Lock"
    const fingerprint = async() => {
        if (availability === false) { return; }
        if (fingerprint_status == true) {
            setState(previousState => !previousState);
            setStatus("Fingerprint lock disabled");
            await AsyncStorage.removeItem('@fingerprint').then(()=>setStatus("Fingerprint lock disabled"));
            return;
        } else if (fingerprint_status == false) {
            if (pin === false) {
                setStatus("Set a backup PIN to use fingerprint");
                Vibration.vibrate([100, 100, 100, 100])
                return;
            } else {
                setState(previousState => !previousState);
                await AsyncStorage.setItem('@fingerprint', "true").then(()=>setStatus("Fingerprint lock enabled"))
            }
        }
    }

    React.useEffect(() => {
        //determine status of locks upon loading screen
        const unsubscribe = navigation.addListener('focus', async() => {
            //PIN Lock status
            // const temp = await AsyncStorage.getItem('@pin');
            if (await AsyncStorage.getItem('@pin')!=null){
                setPIN(pin = true);
                setStatus("PIN Lock is currently active");
                if (await AsyncStorage.getItem('@fingerprint')!=null){
                    setState(fingerprint_status = true)
                } else {
                    setState(fingerprint_status = false);
                }
            }else{
                setPIN(pin = false);
                setStatus("All locks are currently disabled")
            }
            //check fingerprint availability
            FingerprintScanner
                .isSensorAvailable()
                .then()
                .catch(error => Fingerprintcheck(error.name));
        });
        return unsubscribe;
    });
    const style = useDynamicStyleSheet(new DynamicStyleSheet(styles));
    return (
        <ScrollView style={style.root}>
            <View style={style.headercontainer}>
                <Icon name='lock-open' size={200} color='gray' />
            </View>
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <Text style={style.applocktexts}>{status}</Text>
            </View>
            <TouchableNativeFeedback onPress={availability ? fingerprint : () => { Vibration.vibrate([100, 100, 100, 100]) }} background={TouchableNativeFeedback.Ripple('gray')} r>
                <View style={style.element}>
                    <View style={{ flex: 1 }}>
                        <Icon style={style.icons} name='fingerprint' type='material' size={40} color={'gray'} />
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text style={style.applocktexts}>Fingerprint</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                        <Switch
                            disabled={availability}
                            trackColor={availability ? { false: "#767577", true: global.switchtracks } : "#767577"}
                            thumbColor={availability ? fingerprint_status ? global.accent : "#f4f3f4" : "grey"}
                            onValueChange={availability ? fingerprint : () => { Vibration.vibrate([100, 100, 100, 100]) }}
                            value={fingerprint_status}
                            style={{ marginTop: 23, marginRight: 10 }}
                        />
                    </View>
                </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={PIN} background={TouchableNativeFeedback.Ripple('gray')} r>
                <View style={style.element}>
                    <View style={{ flex: 1 }}>
                        <Icon style={style.icons} name='dialpad' type='material' size={40} color={'gray'} />
                    </View>
                    <View style={{ flex: 3 }}>
                        <Text style={style.applocktexts}>PIN</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                        <Switch
                            trackColor={{ false: "#767577", true: global.switchtracks }}
                            thumbColor={pin ? global.accent : "#f4f3f4"}
                            onValueChange={PIN}
                            value={pin}
                            style={{ marginTop: 23, marginRight: 10 }}
                        />
                    </View>
                </View>
            </TouchableNativeFeedback>
            <Modal
                animationType='slide'
                transparent={true}
                visible={seeker}>
                <View style={style.modal}>
                    <View style={style.pinseeker}>
                        <View style={{ height: 150, marginLeft: 20, marginRight: 20 }}>
                            <TextField
                                label='Set a 4-digit PIN'
                                onChangeText={pin1 => setpin1(pin1)}
                                onSubmitEditing={() => { PIN1.current.focus() }}
                                textContentType='password'
                                returnKeyType="next"
                                secureTextEntry={true}
                                maxLength={4}
                                secureTextEntry keyboardType='number-pad'
                                tintColor={global.accent}
                                textColor={isDarkMode ? "white" : "black"}
                                baseColor={isDarkMode ? "#f2f2f2" : "black"}
                                error={error}
                            />
                            <TextField
                                ref={PIN1}
                                label='Confirm PIN'
                                onChangeText={pin2 => setpin2(pin2)}
                                onSubmitEditing={savePIN}
                                textContentType='password'
                                secureTextEntry={true}
                                maxLength={4}
                                secureTextEntry keyboardType='number-pad'
                                tintColor={global.accent}
                                textColor={isDarkMode ? "white" : "black"}
                                baseColor={isDarkMode ? "#f2f2f2" : "black"}
                                error={error}
                            />
                        </View>
                        <View style={{ flexDirection: 'row-reverse' }}>
                            <Button title="OK" titleStyle={{ color: global.accent }} onPress={savePIN} buttonStyle={style.button} />
                            <Button title="CANCEL" titleStyle={{ color: global.accent }} onPress={() => { showSeeker(false); setError('') }} buttonStyle={style.button} />
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

export default applock;