import * as React from 'react';
import { View, BackHandler, Modal, Image, Text, Dimensions, Vibration, TouchableOpacity } from 'react-native';
import { useDarkMode, DynamicStyleSheet, useDynamicStyleSheet, DynamicValue } from 'react-native-dark-mode';
import ProgressBar from 'react-native-progress/Bar';
import { OutlinedTextField } from 'react-native-material-textfield';
import { Button } from 'react-native-elements';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import styles from '../assets/styles';
import Terms from '../assets/terms';
import PrivacyPolicy from '../assets/privacypolicy';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
///Both pin & RNFS are repeatedly used in different places. Let's decalre them here itself
var RNFS = require('react-native-fs');
var pin = RNFS.DocumentDirectoryPath + '/lock.txt';
function Splash({ navigation }) {
    const styles = useDynamicStyleSheet(DynamicStyles);
    var isfirsttime = false;
    //====================all the state hooks==================================
    let [isfirstime, setfirsttime] = React.useState(false);
    let [visibility, setVisible] = React.useState(false);
    let [status, setStatus] = React.useState('');
    let [PIN, setPIN] = React.useState('');
    let [error, setError] = React.useState('');
    let [terms, showTerms] = React.useState(false);
    let [privacy, showPrivacy] = React.useState(false);
    //===================================================================
    const field = React.useRef(null);

    //we start immediately after screen mounts
    React.useEffect(() => {
        setStatus("Please wait..")
        const unsubscribe = navigation.addListener('focus', () => {
            var file = RNFS.DocumentDirectoryPath + '/FirstTime.txt'
            RNFS.readFile(file, 'utf8')
                .then(() => {
                    setStatus("Starting FlashGrabs");
                    return;
                })
                .catch(() => {
                    setStatus("Welcome to FlashGrabs");
                    isfirsttime = true;
                    setfirsttime(true)
                    return;
                })
            var path = RNFS.DocumentDirectoryPath + '/Fingerprint.txt'
            //read the file
            RNFS.readFile(path, 'utf8') //if it exists, it'll read and fulfill Promise
                //if it exists authenticate using fingerprint
                .then(() => {
                    setStatus("Fingerprint login");
                    fingerprint();
                })
                //if promise is rejected, pass it to PIN lock..
                .catch(() => {
                    RNFS.readFile(pin, 'utf8')
                        .then(() => {
                            setStatus("Login with PIN");
                            setVisible(true);
                            return;
                        })//if PIN lock too is disabled, pass it on..
                        .catch(() => {
                            securepass();
                        })
                })
        });
        return unsubscribe;
    }, [navigation])

    //function to unlock with fingerprint
    function fingerprint() {
        FingerprintScanner
            .authenticate({ title: 'Log into FlashGrab', description: "If fingerprint isn't working, use PIN. Don't waste time before a sale", cancelButton: "Use PIN" })
            .then(() => {
                securepass();
            }).catch((error) => {
                //if fingerprint scanner was disabled in device settings, the app should know
                if (error.name === "FingerprintScannerNotEnrolled") {
                    var RNFS = require('react-native-fs');
                    RNFS.unlink(RNFS.DocumentDirectoryPath + '/Fingerprint.txt');
                    setStatus("Fingerprint disabled. Waiting for PIN")
                }
                setStatus("Waiting for PIN")
                setVisible(true);
            })
    }

    //PIN lock handling function
    const pinlock = () => {
        //we have written pin inside lock.txt file
        RNFS.readFile(pin, 'utf8')
            .then((contents) => {
                //if it matches, pass it on.
                if (PIN === contents) {
                    securepass();
                } else if (!PIN) { //blank PIN
                    Vibration.vibrate([50, 100, 50, 100]);
                    setError("Enter PIN");
                    return;
                } else { //wrong PIN. Break function.
                    Vibration.vibrate([50, 100, 50, 100, 50, 100]);
                    setError("Wrong PIN");
                    field.current.clear();
                    field.current.focus();
                    return;
                }
            })
    }

    const launched = () => {
        setfirsttime(false);
        isfirsttime = false;
        var file = RNFS.DocumentDirectoryPath + '/FirstTime.txt'
        RNFS.writeFile(file, "Enabled", 'utf8')
            .then(() => { securepass() })
            .catch((err) => { console.log(err.message); });
    }

    //function to pass control to Home Screen
    const securepass = () => {
        //due to some bug in line 40, this if-else block is necessary
        if (isfirsttime === false) {
            setStatus("Starting FlashGrabs");
            setVisible(false);
            //once authenticated, we remove this screen from the stack
            navigation.reset({
                index: 0,
                routes: [{ name: 'FlashGrab' }],
            });
            //and immediately navigate to the homescreen stack
            navigation.navigate('FlashGrab');
        } else {
            return;
        }
    }

    const isDarkMode = useDarkMode();
    return (
        <View style={styles.root}>
            <Modal
                animationType='slide'
                transparent={true}
                visible={visibility}
                onRequestClose={() => {
                    setVisible(false);
                    setStatus("Login cancelled");
                    //let's give the user a 1 sec delay to read the status
                    setTimeout(() => {
                        setStatus("FlashGrabs is closing....");
                        BackHandler.exitApp();
                    }, 1000);
                }}>
                <View style={styles.modal}>
                    <View style={styles.pinseeker}>
                        <View style={{ marginTop: 10, alignSelf: 'center' }}>
                            <Text style={styles.heading}>Login with PIN</Text>
                            <View style={{ width: 100, marginLeft: 80 }}>
                                <OutlinedTextField
                                    ref={field}
                                    label={"PIN"}
                                    maxLength={4}
                                    error={error}
                                    onSubmitEditing={pinlock}
                                    onChangeText={PIN => setPIN(PIN)}
                                    secureTextEntry={true}
                                    tintColor={global.accent}
                                    secureTextEntry keyboardType='number-pad'
                                    textColor={isDarkMode ? "white" : "black"}
                                    baseColor={isDarkMode ? "#f2f2f2" : "black"} />
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 120 }}>
                                <Button
                                    title="CANCEL"
                                    titleStyle={{ color: global.accent }}
                                    buttonStyle={styles.button}
                                    onPress={() => BackHandler.exitApp()}
                                />
                                <Button
                                    title="OK"
                                    titleStyle={{ color: global.accent }}
                                    buttonStyle={styles.button}
                                    onPress={() => pinlock()}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType='slide'
                transparent={true}
                visible={terms}
                onRequestClose={() => showTerms(false)}
            >
                <Terms />
            </Modal>
            <Modal
                animationType='slide'
                transparent={true}
                visible={privacy}
                onRequestClose={() => showPrivacy(false)}
            >
                <PrivacyPolicy />
            </Modal>
            <View style={styles.container}>
                <Image
                    style={styles.image}
                    source={require('../assets/img/logo.png')}
                />
                <ProgressBar width={250} style={{ marginTop: 50 }} height={4} indeterminate={true} borderRadius={0} useNativeDriver={true} borderWidth={0} color={global.accent} />
                <Text style={styles.text}>{status}</Text>
                {isfirstime ? <View>
                    <View style={{ marginTop: 30, marginLeft: 40 }}>
                        <Button
                            onPress={launched}
                            buttonStyle={[styles.longbutton, { backgroundColor: global.accent }]} title="START" />
                    </View>
                    <View style={{ marginTop: 30 }}>
                        <Text style={styles.text}>By clicking START, you agree to FlashGrabs</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => showTerms(true)} style={{ marginLeft: 30, marginTop: 5 }}>
                                <Text style={{ color: global.accent, fontWeight: 'bold' }}>Terms of Use</Text>
                            </TouchableOpacity>
                            <Text style={styles.text}>  &  </Text>
                            <TouchableOpacity onPress={() => showPrivacy(true)} style={{ marginTop: 5 }}>
                                <Text style={{ color: global.accent, fontWeight: 'bold' }}>Privacy Policy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View> : null}
            </View>
        </View>
    );
};

const DynamicStyles = new DynamicStyleSheet(styles);

export default Splash;