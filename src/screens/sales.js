// Example: Example of SQLite Database in React Native
// https://aboutreact.com/example-of-sqlite-database-in-react-native
// Screen to view single user

import React, { useState } from 'react';
import { Text, Image, View, TouchableNativeFeedback, Linking, Vibration } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Icon } from 'react-native-elements';
import NetInfo from "@react-native-community/netinfo";
import Clipboard from '@react-native-community/clipboard'
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode';
import Subheader from '../assets/Subheader';
import styles from '../assets/styles'

var moment = require('moment');
var db = openDatabase({ name: 'FlashGrab.db' });

function Sale_Elaborated({ route, navigation }) {
  const { item } = route.params;
  let [masked, mask] = React.useState(false);
  let [ready, Ready] = React.useState(false);
  let [SaleData, setSaleData] = useState({});
  let [status, setStatus] = React.useState("Checking connections");
  const styles = useDynamicStyleSheet(Dynamicstyles)
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // console.log(item);
      setSaleData({});
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM table_sales where product_id = ?',
          [item],
          (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {
              setSaleData(results.rows.item(0));
            } else {
              alert('No such item enrolled');
            }
          }
        );
      });
    });
    return unsubscribe;
  }, [route, navigation])
  React.useEffect(() => {
    const interval = setInterval(() => {
      NetInfo.fetch().then(state => {
        if (state.isConnected === false) {
          setStatus("Connect to the internet to start purchase");
          Ready(false);
        } else if (state.isInternetReachable === false) {
          setStatus("Purchase won't start as internet isn't reachable");
          Ready(false);
        } else { setStatus("Ready to go.."); Ready(true) }
      });
    }, 2000)
    return () => clearInterval(interval);
  }, [])
  var image;
  if (SaleData.seller === "Flipkart") {
    image = require('../assets/img/flipkart.png');
  } else if (SaleData.seller === "Amazon") {
    image = require('../assets/img/amazon.webp');
  }
  const copy = () => {
    Clipboard.setString(SaleData.url)
    Vibration.vibrate(100)
    setStatus("Copied to clipboard!")
  }
  const start = () => {
    if (ready === false) {
      Vibration.vibrate(100)
    } else { navigation.navigate('Core', { url: SaleData.url, username: SaleData.username, password: SaleData.password, pin: SaleData.pin, cvv: SaleData.cvv, seller: SaleData.seller }) }
  }
  const date = new Date();
  const dt1 = Date.parse(SaleData.date);
  date.setTime(dt1);
  return (
    <View>
      <ScrollView style={[styles.root, { flex: null }]}>
        <View style={styles.headercontainer}>
          <Image
            style={styles.seller}
            source={image} />
          <Text style={styles.product_name}>{SaleData.product_name}</Text>
        </View>
        <View style={{ alignItems: 'center', marginTop: 15 }}>
          <Text style={styles.status}>{status}</Text>
        </View>
        <View>
          <Subheader text={'Account Credentials'} />
          <View style={styles.details}>
            <View style={{ flex: 1 }}>
              <Icon name='account-circle' style={styles.detailsicon} type='material' size={40} color={'gray'} />
            </View>
            <View style={{ flex: 5 }}>
              <Text style={styles.detailstext}>Username: {SaleData.username}</Text>
            </View>
          </View>
          <View style={styles.details}>
            <View style={{ flex: 1 }}>
              <Icon name='lock-open' style={styles.detailsicon} type='material' size={40} color={'gray'} />
            </View>
            <View style={{ flex: 4 }}>
              <Text style={styles.detailstext}>Password: {masked ? SaleData.password : "⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Button
                buttonStyle={{ marginTop: 8, backgroundColor: 'transparent' }}
                onPress={() => mask(previousState => !previousState)}
                icon={
                  <Icon name={masked ? 'visibility-off' : 'visibility'} type='material' size={30} color='gray' />
                }
              />
            </View>
          </View>
          <View style={styles.details}>
            <View style={{ flex: 1 }}>
              <Icon name='business' style={styles.detailsicon} type='material' size={38} color={'gray'} />
            </View>
            <View style={{ flex: 5 }}>
              <Text style={styles.detailstext}>Address PIN Code: {SaleData.pin}</Text>
            </View>
          </View>
          <View>
            <Subheader text={'Sale Details'} />
            <View style={styles.details}>
              <View style={{ flex: 1 }}>
                <Icon name='shopping-cart' style={styles.detailsicon} type='material' size={40} color={'gray'} />
              </View>
              <View style={{ flex: 5 }}>
                <Text style={styles.detailstext}>Seller: {SaleData.seller}</Text>
              </View>
            </View>
            <View style={styles.details}>
              <View style={{ flex: 1 }}>
                <Icon name='date-range' style={styles.detailsicon} type='material' size={40} color={'gray'} />
              </View>
              <View style={{ flex: 5 }}>
                <Text style={styles.detailstext}>Date: {moment(date).format("MMMM Do, YYYY, dddd")}</Text>
              </View>
            </View>
            <View style={styles.details}>
              <View style={{ flex: 1 }}>
                <Icon name='alarm' style={styles.detailsicon} type='material' size={40} color={'gray'} />
              </View>
              <View style={{ flex: 5 }}>
                <Text style={styles.detailstext}>Time: {moment(date).format("h:mm a").toUpperCase()}</Text>
              </View>
            </View>
            <TouchableNativeFeedback onPress={() => Linking.openURL(SaleData.url)} onLongPress={copy} background={TouchableNativeFeedback.Ripple('gray')} r>
              <View style={[styles.details, { height: 110 }]}>
                <View style={{ flex: 1 }}>
                  <Icon name='link' style={styles.detailsicon} type='material' size={40} color={'gray'} />
                </View>
                <View style={{ flex: 5 }}>
                  <Text style={styles.detailstext}>URL: {SaleData.url}</Text>
                </View>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <Button
          buttonStyle={ready ? [styles.buttonStyle, { backgroundColor: global.accent }] : [styles.buttonStyle, { backgroundColor: 'grey' }]}
          onPress={start}
          icon={
            <Icon name='shopping-cart' type='material' size={40} color='white' />
          }
        />
      </View>
    </View>
  );
};

const Dynamicstyles = new DynamicStyleSheet(styles)

export default Sale_Elaborated;