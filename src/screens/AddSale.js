import React from 'react'
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDynamicStyleSheet, useDarkMode } from 'react-native-dark-mode'
import { OutlinedTextField } from 'rn-material-ui-textfield'
import { URL } from 'react-native-url-polyfill';
import { WebView } from 'react-native-webview'
import { openDatabase } from 'react-native-sqlite-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import dynamicStyles from '../assets/styles/AddSale'
import Parser from '../assets/misc/parser'
import LoadingAnimation from '../assets/misc/animation';
import keys from '../../keys/local'

var CryptoJS = require("crypto-js");
var db = openDatabase({ name: 'FlashGrab.db' });
var moment = require('moment')
const AddSale = ({ navigation, route }) => {
    const styles = useDynamicStyleSheet(dynamicStyles)
    const isDarkMode = useDarkMode()
    const fadeAnim = React.useRef(new Animated.Value(1)).current;
    let [index, set_index] = React.useState([true, false, false, false, false])
    let [url, seturl] = React.useState('');
    let [seller, set_seller] = React.useState('')
    let [username, set_username] = React.useState('')
    let [password, set_password] = React.useState('')
    let [DateTime, setDateTime] = React.useState('')
    let [payment_method, set_method] = React.useState("COD")
    let [name, set_name] = React.useState('')
    let [price, set_price] = React.useState('')
    let [image, set_image] = React.useState('')
    let [cvv, set_cvv] = React.useState('')
    let [upi, set_upi] = React.useState('')

    // This useEffect hook is present only to act as a bug fix. For explanation, refer to the bottom <WebView/> code
    React.useEffect(() =>
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            seturl('')
            navigation.dispatch(e.data.action)
        }),
        []
    );

    React.useEffect(() => {
        /*
        This timer was also added here to fix the <WebView/> bug.
        If we set the URL as soon as screen mounts, it renders the <WebView/> along with it causing the app to crash.
        The obvious fix is to give some time for the rest of the components to render, and then render the <WebView/> after it.
        */
        setTimeout(() => {
            const { placeholder } = route.params;
            seturl(placeholder)
        }, 1000)
    }, [])

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

    const switch_to = (value) => {
        var temp = [false, false, false, false, false]
        if (value === "back") {
            temp[index.indexOf(true) - 1] = true
        } else if (value === "next") {
            temp[index.indexOf(true) + 1] = true
        }
        set_index(temp)
    }

    const parseHTML = (html) => {
        if (!html || html === "<head></head><body></body>") { }
        else {
            var parser = new Parser(html)
            var data = parser.data(seller)
            set_name(data[0])
            set_price(data[1])
            set_image(data[2])
        }
    }

    const schedule = () => {
        switch_to("next")
        animate()
        while (!name || !price || !image) { }
        db.transaction(function (tx) {
            tx.executeSql(
                'INSERT INTO sales (url, username, password, payment_method, payment_data, seller, date, title, price, image) VALUES (?,?,?,?,?,?,?,?,?,?)',
                [url, CryptoJS.AES.encrypt(username.toString(), keys).toString(), CryptoJS.AES.encrypt(password.toString(), keys).toString(), payment_method, payment_method === "Card" ? CryptoJS.AES.encrypt(cvv.toString(), keys).toString() : payment_method === "UPI" ? CryptoJS.AES.encrypt(upi.toString(), keys).toString() : null, seller, DateTime.toISOString(), name, price, image],
                (result) => {
                    seturl('')
                    navigation.navigate('Home');
                }
            );
        });
    }

    //section to enter URL's
    const URLSelector = () => {
        let [error, set_error] = React.useState('')
        let [input, set_input] = React.useState(url)
        const check = () => {
            if (!input) { set_error("Please enter a URL") }
            else {
                try {
                    const link = new URL(input)
                    if (link.host === "flipkart.com" || link.host === "dl.flipkart.com" || link.host === "www.flipkart.com" || link.host === "www.dl.flipkart.com") {
                        set_seller("Flipkart")
                        seturl(input)
                        switch_to("next")
                    } else if (link.host === "amazon.in" || link.host === "www.amazon.in") {
                        set_seller("Amazon")
                        seturl(input)
                        switch_to("next")
                    } else { set_error("Sorry, unsupported seller") }
                } catch {
                    set_error('Please enter a valid URL')
                }
            }
        }
        return (
            <View style={{ flex: 4 }}>
                <View style={{ flex: 5, margin: 20 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 3 }}>
                            <OutlinedTextField
                                label="Enter URL"
                                onChangeText={input => set_input(input)}
                                onSubmitEditing={check}
                                defaultValue={url}
                                tintColor={global.accent}
                                returnKeyType="next"
                                textColor={isDarkMode ? "white" : "black"}
                                baseColor={isDarkMode ? "#f2f2f2" : "black"}
                                error={error}
                            />
                            <Text style={styles.instruction}>Enter or share the URL of a product from the seller app/website to begin</Text>
                        </View>
                        <View style={{ flex: 2 }}></View>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <View style={{ flex: 8 }}></View>
                    <TouchableOpacity onPress={() => check()} style={[styles.button, { backgroundColor: global.accent }]}><Text style={styles.button_text}>Next</Text></TouchableOpacity>
                </View>
            </View>
        );
    }

    const Account = () => {
        let [input_1, setinput_1] = React.useState(username)
        let [input_2, setinput_2] = React.useState(password)
        let [error_1, seterror_1] = React.useState('')
        let [error_2, seterror_2] = React.useState('')
        const field = React.useRef(null)
        const check = () => {
            if (!input_1 || !input_2) {
                if (!input_1) { seterror_1('Please enter a username') }
                if (!input_2) { seterror_2('Please enter a password') }
            } else {
                set_username(input_1)
                set_password(input_2)
                switch_to("next")
            }
        }
        return (
            <View style={{ flex: 4 }}>
                <View style={{ flex: 5, margin: 20 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 3 }}>
                            <OutlinedTextField
                                label="Enter username"
                                onChangeText={input_1 => setinput_1(input_1)}
                                onSubmitEditing={() => field.current.focus()}
                                returnKeyType="next"
                                defaultValue={username}
                                tintColor={global.accent}
                                textColor={isDarkMode ? "white" : "black"}
                                baseColor={isDarkMode ? "#f2f2f2" : "black"}
                                error={error_1}
                            />
                            <Text style={styles.instruction}>Enter the username of your {seller} account to be used for the purchase.</Text>
                            <OutlinedTextField
                                ref={field}
                                label="Enter password"
                                onChangeText={input_2 => setinput_2(input_2)}
                                onSubmitEditing={check}
                                returnKeyType="next"
                                defaultValue={password}
                                tintColor={global.accent}
                                textColor={isDarkMode ? "white" : "black"}
                                baseColor={isDarkMode ? "#f2f2f2" : "black"}
                                error={error_2}
                            />
                            <Text style={styles.instruction}>Enter the login password of your {seller} account. This is stored securely and isn't shared with anyone else.</Text>
                        </View>
                        <View style={{ flex: 2 }}></View>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <View style={{ flex: 8 }}></View>
                    <TouchableOpacity onPress={() => switch_to("back")} style={[styles.button, { backgroundColor: global.accent }]}><Text style={styles.button_text}>Back</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => check()} style={[styles.button, { backgroundColor: global.accent }]}><Text style={styles.button_text}>Next</Text></TouchableOpacity>
                </View>
            </View >

        );
    }

    const Payments = () => {
        let [active, setactive] = React.useState(payment_method)
        let [input_1, setinput_1] = React.useState(cvv)
        let [input_2, setinput_2] = React.useState(upi)
        let [error_1, seterror_1] = React.useState('')
        let [error_2, seterror_2] = React.useState('')
        const check = () => {
            set_method(active)
            if (payment_method === "Card") {
                if (!input_1) { seterror_1('Please enter your CVV') }
                else { set_cvv(input_1); switch_to("next") }
            } else if (payment_method === "UPI") {
                if (!input_2) { seterror_2('Please enter your UPI ID') }
                else { set_upi(input_2); switch_to("next") }
            } else { switch_to("next") }
        }
        const SegmentedControl = ({ value }) => {
            return (
                <TouchableWithoutFeedback onPress={() => setactive(value)}>
                    <View style={[styles.segmented_control, { backgroundColor: active === value ? global.accent : isDarkMode ? '#333333' : '#f2f2f2' }]}>
                        <Text style={[styles.segmented_control_text, { color: active === value ? 'white' : global.accent }]}>{value}</Text>
                    </View>
                </TouchableWithoutFeedback>
            );
        }
        return (
            <View style={{ flex: 4 }}>
                <View style={{ flex: 5 }}>
                    <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <SegmentedControl value="COD" />
                        <SegmentedControl value="Card" />
                        <SegmentedControl value="UPI" />
                    </View>
                    <View style={{ flex: 3, margin: 20 }}>
                        {active === "COD" ? <View style={{ margin: 10, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={styles.instruction}>We'll select the Cash-on-Delivery (COD) option as payment method during checkout.</Text>
                        </View> : null}
                        {active === "Card" ? <View style={{ flex: 1 }}>
                            <OutlinedTextField
                                label="Enter CVV"
                                onChangeText={input_1 => setinput_1(input_1)}
                                returnKeyType="next"
                                defaultValue={cvv}
                                returnKeyType="next"
                                secureTextEntry={true}
                                secureTextEntry keyboardType='number-pad'
                                tintColor={global.accent}
                                textColor={isDarkMode ? "white" : "black"}
                                baseColor={isDarkMode ? "#f2f2f2" : "black"}
                                error={error_1}
                            />
                            <Text style={styles.instruction}>Enter the CVV of the debit card that you've saved in you {seller} account for purchase.</Text>
                        </View> : null}
                        {active === "UPI" ? <View style={{ flex: 1 }}>
                            <OutlinedTextField
                                label="Enter UPI ID"
                                onChangeText={input_2 => setinput_2(input_2)}
                                returnKeyType="next"
                                defaultValue={upi}
                                returnKeyType="next"
                                tintColor={global.accent}
                                textColor={isDarkMode ? "white" : "black"}
                                baseColor={isDarkMode ? "#f2f2f2" : "black"}
                                error={error_2}
                            />
                            <Text style={styles.instruction}>Enter your UPI ID for the purchase. Please be online to complete the transaction during the time of purchase.</Text>
                        </View> : null}
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <View style={{ flex: 8 }}></View>
                    <TouchableOpacity onPress={() => switch_to("back")} style={[styles.button, { backgroundColor: global.accent }]}><Text style={styles.button_text}>Back</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => check()} style={[styles.button, { backgroundColor: global.accent }]}><Text style={styles.button_text}>Next</Text></TouchableOpacity>
                </View>
            </View>
        );
    }

    const Datetime = () => {
        let [date, set_date] = !DateTime ? React.useState("Choose a date") : React.useState(moment(DateTime).format("MMMM Do, YYYY"))
        let [time, set_time] = !DateTime ? React.useState("Choose a time") : React.useState(moment(DateTime).format("h:mm a").toUpperCase())
        let [visibility, set_visibility] = React.useState(false)
        let [error, set_error] = React.useState('')
        const check = (value) => {
            set_visibility(false)
            setDateTime('')
            if (value < new Date()) { set_error('Date/time has already passed') }
            else if (value > new Date()) {
                setDateTime(value);
                set_error('')
            }
            set_date(moment(value).format("MMMM Do, YYYY"));
            set_time(moment(value).format("h:mm a").toUpperCase());
        }
        const verify = () => { if (!DateTime) { set_error('Please pick a date & time') } else { schedule() } }
        return (
            <View style={{ flex: 4 }}>
                <View style={{ flex: 5, margin: 20 }}>
                    <TouchableWithoutFeedback onPress={() => set_visibility(true)}>
                        <View style={{ flex: 1, margin: 10 }}>
                            <View style={[styles.date_container, { borderColor: error ? 'rgb(213, 0, 0)' : styles.date_container.borderColor }]}>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <MaterialIcon name="calendar-today" style={[styles.icon, { color: error ? 'rgb(213, 0, 0)' : styles.icon.color }]} />
                                    <Text style={[styles.icon_caption, { color: error ? 'rgb(213, 0, 0)' : styles.icon_caption.color }]}>{date}</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name="clock" style={[styles.icon, { color: error ? 'rgb(213, 0, 0)' : styles.icon.color }]} />
                                    <Text style={[styles.icon_caption, { color: error ? 'rgb(213, 0, 0)' : styles.icon_caption.color }]}>{time}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}></View>
                                <View style={{ flex: 10 }}><Text style={styles.error}>{error}</Text></View>
                                <View style={{ flex: 1 }}></View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{ flex: 1, margin: 10 }}>
                        <Text style={styles.instruction}>Tell us the date & time of this sale using the selector above and we'll remind you then.</Text>
                        <DateTimePickerModal
                            isDarkModeEnabled={true}
                            isVisible={visibility}
                            mode="datetime"
                            onConfirm={check}
                            onCancel={() => set_visibility(false)}
                        />
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <View style={{ flex: 8 }}></View>
                    <TouchableOpacity onPress={() => switch_to("back")} style={[styles.button, { backgroundColor: global.accent }]}><Text style={styles.button_text}>Back</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => verify()} style={[styles.button, { backgroundColor: global.accent }]}><Text style={styles.button_text}>Schedule</Text></TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.root}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.heading}>Schedule A Sale</Text>
            </View>
            {index[4] ? <View style={{ flex: 8, alignItems: 'center' }}>
                <View style={{ flex: 1 }}></View>
                <View style={{ flex: 4 }}>
                    <LoadingAnimation opacity={fadeAnim} />
                </View>
            </View>
                : <View style={{ flex: 8 }}>
                    <View style={styles.gallery}></View>
                    <View style={{ flex: 5 }}>
                        {index[0] ? <URLSelector /> : null}
                        {index[1] ? <Account /> : null}
                        {index[2] ? <Payments /> : null}
                        {index[3] ? <Datetime /> : null}
                    </View>
                </View>}
            {/*
            A bug is persistent with react-native-webview where a <WebView/> can't be wrapped a parent <View>, or else the whole app will crash when navigating.
            But, we have to wrap it like so to avoid it from showing up on the screen.

            The fix: We only render the <WebView/> along with parent <View> if the url has been entered. If someone navigates back after entering the URL in the 
                     textfield, we'll use that useEffect hook at the top to catch the navigation event and we'll immediately clear the url state hook to make the <WebView/>
                     "vanish", thus magically avoiding the whole app from crashing ;)
            */}
            {url ? <View style={{ flex: 0 }}>
                <WebView
                    style={{ height: 0 }}
                    source={{ uri: !index[0] ? url : '' }}
                    injectedJavaScript={`setTimeout(function () {window.ReactNativeWebView.postMessage(document.getElementsByTagName('html')[0].innerHTML);}, 1000)`}
                    onMessage={(event) => parseHTML(event.nativeEvent.data)}
                />
            </View> : null}
        </SafeAreaView>
    );
}

export default AddSale