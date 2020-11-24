import * as React from 'react';
import { View, BackHandler, Modal, Image, Text, Vibration, TouchableOpacity } from 'react-native';
import { useDarkMode, DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode';
import ProgressBar from 'react-native-progress/Bar';
import { OutlinedTextField } from 'react-native-material-textfield';
import { Button } from 'react-native-elements';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../assets/styles';
import Terms from '../assets/terms';
import PrivacyPolicy from '../assets/privacypolicy';

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
        const unsubscribe = navigation.addListener('focus', async() => {
            if(await AsyncStorage.getItem('@launched')!=null){
                if (await AsyncStorage.getItem('@fingerprint')!=null){
                    setStatus("Fingerprint Login");
                    fingerprint();
                } else {
                    if (await AsyncStorage.getItem('@pin')!=null){
                        setStatus("Login with PIN");
                        setVisible(true);
                        return
                    }else{
                        securepass();
                    }
                }
            } else {
                setStatus("Welcome to FlashGrab");
                isfirstime = true;
                setfirsttime(true);
                return;
            }
            // var file = RNFS.DocumentDirectoryPath + '/FirstTime.txt'
            // RNFS.readFile(file, 'utf8')
            //     .then(() => {
            //         setStatus("Starting FlashGrab");
            //         return;
            //     })
            //     .catch(() => {
            //         setStatus("Welcome to FlashGrabs");
            //         isfirsttime = true;
            //         setfirsttime(true)
            //         return;
            //     })
            //read the file
        });
        return unsubscribe;
    }, [navigation])

    //function to unlock with fingerprint
    function fingerprint() {
        FingerprintScanner
            .authenticate({ title: 'Log into FlashGrab', description: "If fingerprint isn't working, use PIN. Don't waste time before a sale", cancelButton: "Use PIN" })
            .then(() => {
                securepass();
            }).catch(async(error) => {
                //if fingerprint scanner was disabled in device settings, the app should know
                if (error.name === "FingerprintScannerNotEnrolled") {
                    await AsyncStorage.removeItem('@fingerprint');
                    setStatus("Fingerprint disabled. Waiting for PIN")
                }
                setStatus("Waiting for PIN")
                setVisible(true);
            })
    }

    //PIN lock handling function
    const pinlock = async() => {
        if(PIN === await AsyncStorage.getItem('@pin')){
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
    }

    const launched = async() => {
        setfirsttime(false);
        isfirsttime = false;
        await AsyncStorage.setItem('@launched', "true").then(()=>securepass())
    }

    //function to pass control to Home Screen
    const securepass = () => {
        //due to some bug in line 40, this if-else block is necessary
        if (isfirsttime === false) {
            setStatus("Starting FlashGrab");
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