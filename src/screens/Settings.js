import React from 'react'
import { View, Text, Linking, TouchableWithoutFeedback, Modal, TouchableOpacity, Dimensions } from 'react-native'
import { useDynamicStyleSheet, useDarkMode } from 'react-native-dark-mode'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextField } from 'react-native-material-textfield'
import EncryptedStorage from 'react-native-encrypted-storage';
import FingerprintScanner from 'react-native-fingerprint-scanner'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import dynamicStyles from '../assets/styles/Settings'

const Settings = ({ navigation }) => {
    const styles = useDynamicStyleSheet(dynamicStyles)
    let [fingerprint, set_fingerprint] = React.useState(false)
    let [fp_available, set_availability] = React.useState(true)
    let [selector, toggle_selector] = React.useState(false)
    let [pin, set_pin] = React.useState('')
    let [error, set_error] = React.useState('')
    const isDarkMode = useDarkMode()

    React.useEffect(async () => {
        try {
            const PIN = await EncryptedStorage.getItem("pin");
            if (PIN !== null) {
                set_pin(PIN)
            }
        } catch (error) { }
        try {
            const FP = await EncryptedStorage.getItem("fingerprint");
            if (FP !== null) {
                set_fingerprint(true)
            }
        } catch (error) { }
        FingerprintScanner
            .isSensorAvailable()
            .then(set_error(''))
            .catch(error => {
                if (!error.name === "FingerprintScannerNotEnrolled") { set_availability(false) }
            });
    }, [])

    const toggle_pin = async () => {
        if (!pin) { toggle_selector(true) }
        else {
            await EncryptedStorage.removeItem("pin");
            set_pin('');
            await EncryptedStorage.removeItem("fingerprint");
            set_fingerprint(false)
        }
    }

    const toggle_fp = async () => {
        if (!pin) { set_error('Set a PIN first') }
        else {
            if (!fingerprint) {
                FingerprintScanner
                    .authenticate({ title: 'Verify fingerprint', description: "Verify to use your fingerprints for unlocking FlashGrab", cancelButton: "Cancel" })
                    .then(async () => { set_error(''); await EncryptedStorage.setItem("fingerprint", 'true'); set_fingerprint(true) })
                    .catch((error) => {
                        if (error.name === "FingerprintScannerNotEnrolled") set_error('Register in settings first')
                    })
            }
            else { await EncryptedStorage.removeItem("fingerprint"); set_fingerprint(false) }
        }
    }

    const SubHeading = ({ heading }) => {
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1 }}></View>
                <View style={{ flex: 10, justifyContent: 'center' }}>
                    <Text style={styles.sub_heading}>{heading}</Text>
                </View>
                <View style={{ flex: 1 }}></View>
            </View>
        );
    }

    const Card = ({ heading, issmall, icon, onpress, active, err }) => {
        return (
            <TouchableOpacity onPress={onpress} style={[styles.card_root, { backgroundColor: active ? global.accent : err ? 'rgb(213, 0, 0)' : styles.card_root.backgroundColor }]}>
                <View style={{ flex: 1 }}></View>
                <View style={{ flex: 4, flexDirection: 'row' }}>
                    <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
                        {icon}
                    </View>
                    <View style={{ flex: issmall ? 2 : 8 }}></View>
                </View>
                <View style={{ flex: 2, flexDirection: 'row' }}>
                    <View style={{ flex: issmall ? 1 : 0.5 }}></View>
                    <View style={{ flex: 4 }}>
                        <Text style={[styles.card_heading, { color: active || err ? 'white' : styles.card_heading.color }]}>{heading}</Text>
                    </View>
                    <View style={{ flex: 1 }}></View>
                </View>
                <View style={{ flex: 1 }}></View>
            </TouchableOpacity>
        );
    }

    const PinSelector = () => {
        let [input_1, setinput_1] = React.useState('')
        let [input_2, setinput_2] = React.useState('')
        let [error_1, seterror_1] = React.useState('')
        let [error_2, seterror_2] = React.useState('')
        const field = React.useRef(null)
        const setpin = async () => {
            if (!input_1 || !input_2) {
                if (!input_1) { seterror_1('Please enter a PIN') }
                if (!input_2) { seterror_2('Please confirm your PIN') }
            } else {
                if (input_1 === input_2) {
                    await EncryptedStorage.setItem("pin", input_1);
                    set_pin(input_1)
                    set_error('')
                    toggle_selector(false)
                } else {
                    seterror_1(`These PIN's don't match`)
                    seterror_2(`These PIN's don't match`)
                }
            }
        }
        return (
            <Modal
                animationType='fade'
                transparent={true}
                visible={selector}
                statusBarTranslucent={true}>
                <View style={styles.modal}>
                    <View style={styles.selector_root}>
                        <View style={{ flex: 1.5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={[styles.selector_heading, { color: global.accent }]}>Set a PIN Lock</Text>
                        </View>
                        <View style={styles.field_container}>
                            <TextField
                                label='Set a 4-digit PIN'
                                onChangeText={input_1 => setinput_1(input_1)}
                                onSubmitEditing={() => { field.current.focus() }}
                                textContentType='password'
                                returnKeyType="next"
                                secureTextEntry={true}
                                maxLength={4}
                                secureTextEntry keyboardType='number-pad'
                                tintColor={global.accent}
                                textColor={isDarkMode ? "white" : "black"}
                                baseColor={isDarkMode ? "#f2f2f2" : "black"}
                                labelTextStyle={{ fontFamily: 'Baloo' }}
                                labelOffset={{ y0: 1 }}
                                error={error_1}
                            />
                            <TextField
                                ref={field}
                                label='Confirm PIN'
                                onChangeText={input_2 => setinput_2(input_2)}
                                onSubmitEditing={setpin}
                                textContentType='password'
                                secureTextEntry={true}
                                maxLength={4}
                                secureTextEntry keyboardType='number-pad'
                                tintColor={global.accent}
                                textColor={isDarkMode ? "white" : "black"}
                                baseColor={isDarkMode ? "#f2f2f2" : "black"}
                                labelTextStyle={{ fontFamily: 'Baloo' }}
                                labelOffset={{ y0: 1 }}
                                error={error_2}
                            />
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
                            <View style={{ flex: 5 }}></View>
                            <View style={{ flex: 2, flexDirection: 'row' }}>
                                <TouchableWithoutFeedback onPress={() => toggle_selector(false)}>
                                    <View style={styles.button}>
                                        <Text style={[styles.button_text, { color: global.accent }]}>CANCEL</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => setpin()}>
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
        )
    }

    return (
        <SafeAreaView style={styles.root}>
            <PinSelector />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                <View style={{ flex: 2 }}></View>
                <Text style={styles.heading}>Settings</Text>
                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => Linking.openURL('https://github.com/vishalkrishnads/FlashGrab')}><Ionicons name="md-code-slash-outline" size={global.width / 15} color={'gray'} /></TouchableOpacity>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Settings")}><MaterialIcons name="policy" size={global.width / 15} color={'gray'} /></TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 8 }}>
                <SubHeading heading={'App Lock'} />
                <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <View style={{ flex: fp_available ? 1 : 0.5 }}></View>
                    {fp_available ? <Card heading={error ? error : 'Fingerprint'} onpress={toggle_fp} active={fingerprint} err={error} issmall={true} icon={<MaterialIcons name={'fingerprint'} style={[styles.card_icon, { color: fingerprint || error ? 'white' : styles.card_icon.color }]} />} /> : null}
                    {fp_available ? <View style={{ flex: 1 }}></View> : null}
                    <Card heading={'PIN Lock'} issmall={fp_available} onpress={toggle_pin} active={pin} icon={<Ionicons name={'keypad'} style={[styles.card_icon, { color: pin ? 'white' : styles.card_icon.color }]} />} />
                    <View style={{ flex: fp_available ? 1 : 0.5 }}></View>
                </View>
                <SubHeading heading={"Instructions"} />
                <View style={{ flex: 4, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 0.5 }}></View>
                    <Card heading={'Guide to using this app'} onpress={() => navigation.navigate('Instructions')} active={false} issmall={false} icon={<MaterialIcons name={'book'} style={styles.card_icon} />} />
                    <View style={{ flex: 0.5 }}></View>
                </View>
                <SubHeading heading={"Contact Us"} />
                <View style={{ flex: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flex: 1 }}></View>
                    <Card heading={'WhatsApp'} active={false} onpress={() => Linking.openURL('https://api.whatsapp.com/send?phone=919074775013&text=Hi%20FlashGrab%20support.%20I%20have%20some%20queries%20regarding%20the%20app%20and%20am%20contacting%20you%20for%20the%20the%20same.')} issmall={true} icon={<Ionicons name={'logo-whatsapp'} style={styles.card_icon} />} />
                    <View style={{ flex: 1 }}></View>
                    <Card heading={'Instagram'} active={false} onpress={() => Linking.openURL('https://instagram.com/flashgrab')} issmall={true} icon={<Ionicons name={'logo-instagram'} style={styles.card_icon} />} />
                    <View style={{ flex: 1 }}></View>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Settings