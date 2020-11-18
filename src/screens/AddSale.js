import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Keyboard, Image, PushNotificationIOS, Linking, SafeAreaView, Alert, Vibration, Dimensions } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { TextField } from 'react-native-material-textfield';
import { openDatabase } from 'react-native-sqlite-storage';
import { DynamicStyleSheet, useDynamicStyleSheet, useDarkMode } from 'react-native-dark-mode';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ProgressBar from 'react-native-progress/Bar';
import styles from '../assets/styles'

var PushNotification = require("react-native-push-notification");
var moment = require('moment');
var db = openDatabase({ name: 'FlashGrab.db' });
const Schedule_Sale = ({ route, navigation }) => {
  global.product_name = "Some good product. But no internet for me to know. Delete this and try again with a nice internet connection.";
  //real date
  let [DateTime, setDateTime] = useState('');
  //display dates
  let [dat, setDate] = useState('');
  let [tim, setTime] = useState('');
  let [product, setProduct] = useState('');
  let [username, setUserName] = useState('');
  const uname = useRef(null);
  let [password, setPassword] = useState('');
  const pass = useRef(null);
  let [cvv, setCVV] = useState('');
  const cv = useRef(null);
  let [pin, setPIN] = useState('');
  const PIN = useRef(null)
  let [error_1, setError1] = useState('');
  let [error_2, setError2] = useState('');
  let [error_3, setError3] = useState('');
  let [error_4, setError4] = useState('');
  let [error_5, setError5] = useState('');
  let [error_6, setError6] = useState(false);
  let [saver, showSaver] = useState(false);
  let [masked, mask] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  useEffect(() => {
    //Accept shared link, if any
    const { placeholder } = route.params;
    if (!placeholder) {
      return;
    } else {      //Both sellers' Android apps share product names along with URL
      //we'll first pop out the last word. Yay, got it. But no....
      var temp1 = placeholder.split(" ").pop();
      //They actually type <product name> [ENTER] <URL>. So, we'll have to pop that out too
      var temp = temp1.split('\n').pop();
      //now we have the URL.
      setProduct(temp);
      //we'll also store the product's name for doing something else later.
      product_name = placeholder.substring(0, placeholder.lastIndexOf(" "));
    }
  })

  //date picker state hook functions
  const showDatePicker = () => {
    Keyboard.dismiss();
    setDatePickerVisibility(true);
  };
  //confirm date function
  function handleConfirm(date) {
    setDatePickerVisibility(false);
    if (date < new Date()) { setError6(true) }
    if (date > new Date() && error_6 === true) { setError6(false) }
    setDateTime(date);
    setDate(moment(date).format("dddd, MMMM Do YYYY"));
    setTime(moment(date).format("h:mm a").toUpperCase());
  }
  
  //schedule notification function.
  const notify = (ID, productname) => {
    PushNotification.localNotificationSchedule({
      id: ID,
      smallIcon: "ic_notification",
      title: "Reminder",
      subText: "Sale Reminder",
      bigText: ("Your sale of " + productname + " will begin shortly! Get back in quickly or ignore if you deleted the sale in app."),
      message: "Your sale will begin shortly. Get back in...",
      date: DateTime,
      allowWhileIdle: true,
    });
  }

  //event triggered on "Schedule Sale" button press
  const save_sale = () => {
    Keyboard.dismiss();
    if (error_6 === true) {
      Alert.alert(
        "Can't do that",
        "You have picked a date and/or time that has already passed. You can only use FlashGrab for upcoming sales."
      );
      Vibration.vibrate([100, 100, 100, 100]);
      return;
    }
    if (!product || !username || !password || !cvv || !pin || !DateTime) {
      if (!product) {
        setError1("This can't be empty")
      }
      if (!username) {
        setError2("Enter your account username for seller site");
      }
      if (!password) {
        setError3("Enter your account password for seller site");
      }
      if (!cvv) {
        setError4("Enter the CVV for your payment method");
      }
      if (!pin) {
        setError5("Enter the PIN Code of your saved address")
      }
      if (!DateTime) {
        setError6(true);
      }
      Vibration.vibrate([100, 100, 100, 100]);
      return;
    }
    showSaver(true);
    //console.log(product, username, password, pin, cvv, DateTime.toISOString());
    var url = product;
    var urlParts = url.replace('http://', '').replace('https://', '').replace('www.', '').split(/[/?#]/);
    var seller;
    if (urlParts[0] === "flipkart.com" || urlParts[0] === "dl.flipkart.com") {
      seller = "Flipkart";
    } else if (urlParts[0] === "amazon.com" || urlParts[0] === "amazon.in") {
      seller = "Amazon";
    } else {
      showSaver(false);
      Vibration.vibrate([100, 100, 100, 100]);
      setError1("Unsupported Seller")
      Alert.alert(
        'Sorry',
        "FlashGrab doesn't support buying from this site at the moment. Please try with another site or please wait for FlashGrab to support it in the future.",
        [
          {
            text: 'Okay'
          }
        ],
      );
      return;
    }
    //fetch the item details
    async function findproduct() {
      var DomParser = require('dom-parser');
      var parser = new DomParser()
      const html = (await (await fetch(product)).text()); // html as text
      var dom = parser.parseFromString(html);
      //since both supported sellers display items as <title> in their websites,
      //we load the HTML pages into memory, we extract & use <title> to identify product name ;)
      const name = dom.getElementsByTagName("TITLE")[0].innerHTML;
      return name;
    }
    findproduct().then((name) => {
      product_name = name;
      const time = DateTime.toISOString();
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO table_sales (product_name, url, username, password, pin, cvv, seller, date) VALUES (?,?,?,?,?,?,?,?)',
          [product_name, product, username, password, pin, cvv, seller, time],
          (result) => {
            notify(result.insertId, product_name);
            navigation.navigate('Home');
          }
        );
      });
    }).catch(() => {
      //if it's rejected for some reason, write the name we got earlier from the sharing app
      const time = DateTime.toISOString();
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO table_sales (product_name, url, username, password, pin, cvv, seller, date) VALUES (?,?,?,?,?,?,?,?)',
          [product_name, product, username, password, pin, cvv, seller, time],
          (result) => {
            notify(result.insertId, product_name);
            navigation.navigate('Home');
          }
        );
      });
    })
  };
  const isDarkMode = useDarkMode();
  const style = useDynamicStyleSheet(new DynamicStyleSheet(styles));
  return (
    <SafeAreaView style={style.root}>
      <View style={{ flex: 1 }}>
        {saver ? <ProgressBar width={500} height={3} color={global.accent} indeterminate={true} borderRadius={0} useNativeDriver={true} borderWidth={0} /> : null}
        <View style={style.saleForm}>
          <ScrollView keyboardShouldPersistTaps='always' keyboardDismissMode='on-drag' showsVerticalScrollIndicator={false}>
            <View>
              <Text style={[style.headings, { marginBottom: 10 }]}>SUPPORTED SITES</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Image
                style={{ borderRadius: 50, width: 100, height: 100 }}
                source={require('../assets/img/flipkart.png')}
              />
              <Image
                style={{ borderRadius: 50, marginLeft: 20, width: 100, height: 100 }}
                source={require('../assets/img/amazon.webp')}
              />
            </View>
            <View>
              <Text style={[style.headings, { marginTop: 20 }]}>SALE DETAILS</Text>
            </View>
            <View style={{ marginLeft: 5, marginRight: 5 }}>
              <TextField
                label='Product URL'
                onChangeText={product => setProduct(product)}
                onSubmitEditing={() => { uname.current.focus(); }}
                defaultValue={product}
                textContentType='URL'
                returnKeyType="next"
                tintColor={global.accent}
                textColor={isDarkMode ? "white" : "black"}
                baseColor={isDarkMode ? "#f2f2f2" : "black"}
                error={error_1}
              />
              <TextField
                ref={uname}
                label='Username'
                onChangeText={username => setUserName(username)}
                defaultValue={username}
                onSubmitEditing={() => { pass.current.focus() }}
                returnKeyType="next"
                keyboardType="email-address"
                tintColor={global.accent}
                textColor={isDarkMode ? "white" : "black"}
                baseColor={isDarkMode ? "#f2f2f2" : "black"}
                error={error_2} />
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: (Dimensions.get('window').width) - 70 }}>
                  <TextField
                    ref={pass}
                    label='Password'
                    onChangeText={password => setPassword(password)}
                    defaultValue={password}
                    onSubmitEditing={() => { cv.current.focus() }}
                    textContentType='password'
                    returnKeyType="next"
                    secureTextEntry={masked}
                    tintColor={global.accent}
                    textColor={isDarkMode ? "white" : "black"}
                    baseColor={isDarkMode ? "#f2f2f2" : "black"}
                    error={error_3}
                  />
                </View>
                <View style={{ marginTop: 10 }}>
                  <Button
                    buttonStyle={{ marginTop: 8, backgroundColor: 'transparent' }}
                    onPress={() => mask(previousState => !previousState)}
                    icon={
                      <Icon name={masked ? 'visibility-off' : 'visibility'} type='material' size={30} color='gray' />
                    }
                  />
                </View>
              </View>
              <TextField
                ref={cv}
                label="CVV"
                onChangeText={cvv => setCVV(cvv)}
                onSubmitEditing={() => { PIN.current.focus() }}
                defaultValue={cvv}
                returnKeyType="next"
                secureTextEntry={true}
                secureTextEntry keyboardType='number-pad'
                maxLength={3}
                tintColor={global.accent}
                textColor={isDarkMode ? "white" : "black"}
                baseColor={isDarkMode ? "#f2f2f2" : "black"}
                error={error_4} />
              <TextField
                ref={PIN}
                label="PIN Code"
                onChangeText={pin => setPIN(pin)}
                defaultValue={pin}
                returnKeyType="next"
                onSubmitEditing={showDatePicker}
                keyboardType='decimal-pad'
                maxLength={6}
                tintColor={global.accent}
                textColor={isDarkMode ? "white" : "black"}
                baseColor={isDarkMode ? "#f2f2f2" : "black"}
                error={error_5} />
              <View style={error_6 ? [style.datetimefield, { borderBottomColor: 'rgb(213, 0, 0)', borderBottomWidth: 2 }] : style.datetimefield}>
                <TouchableWithoutFeedback style={style.datetime} onPress={showDatePicker}>
                  <View style={{ alignItems: 'flex-start' }}>
                    <Text style={error_6 ? { fontSize: 18, color: 'rgb(213, 0, 0)' } : style.datetimetext}>Date: {dat}</Text>
                    <Text style={error_6 ? { fontSize: 18, color: 'rgb(213, 0, 0)' } : style.datetimetext}>Time: {tim}</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
              {error_6 ? <Text style={{ color: 'rgb(213, 0, 0)', fontSize: 12, fontWeight: '100' }}> Check this once more</Text> : null}
              <View>
                <DateTimePickerModal
                  isDarkModeEnabled={true}
                  isVisible={isDatePickerVisible}
                  mode="datetime"
                  onConfirm={handleConfirm}
                  onCancel={() => setDatePickerVisibility(false)}
                />
              </View>
              <View style={{ marginTop: 10, marginBottom: 20 }}>
                <Button buttonStyle={{ backgroundColor: global.accent }} title="Schedule Sale" onPress={save_sale} />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Schedule_Sale;