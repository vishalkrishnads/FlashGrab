import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableNativeFeedback, Image, Vibration, Alert } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import { openDatabase } from 'react-native-sqlite-storage';
import { useDarkMode, DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode';
import ShareMenu from 'react-native-share-menu';
import Swipeout from 'react-native-swipeout'; //Yes, that IS iOS swipeout LOL
import Schedule_Sale from './AddSale';
import Sale_Elaborated from './sales';
import buy from './core-engine';
import Header from '../assets/mainheader';
import styles from '../assets/styles'

var moment = require('moment');
var db = openDatabase({ name: 'FlashGrab.db' });
const HomeScreen = ({ navigation }) => {

  //If app is opened from the share menu, this callback handles it.
  const handleShare = React.useCallback((item) => {
    if (!item) {
      return;
    }
    //stringify the data, or it can't be set as the default value
    var temp = (String(item.data));
    //console.log(temp);
    //navigate with the URL as a param placeholder
    navigation.navigate('Schedule_Sale', { placeholder: temp });
    []
  });
  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
  }, []);
  useEffect(() => {
    ShareMenu.addNewShareListener(handleShare);
  }, []);

  const styles = useDynamicStyleSheet(Dynamicstyles);
  let [flatListItems, setFlatListItems] = useState([]);
  let [addmessage, showMessage] = useState(false);

  //function to delete one item
  const deleteItem = (id) => {
    Vibration.vibrate(40);
    Alert.alert(
      'Confirm Delete',
      'Are you sure want to delete the sale of this item?',
      [
        { text: "Cancel", style: 'cancel', onPress: () => { } },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => [
            //delete the item from DB
            db.transaction((tx) => {
              tx.executeSql(
                'DELETE FROM table_sales WHERE product_id=?',
                [id],
              );
            }),
            //refresh the list
            db.transaction((tx) => {
              tx.executeSql('SELECT * FROM table_sales', [], (tx, results) => {
                var temp = [];
                for (let i = 0; i < results.rows.length; ++i)
                  temp.push(results.rows.item(i));
                //if db is empty, displat the add message
                //flag for test
                if (Array.isArray(temp) && temp.length) {
                  setFlatListItems(temp.reverse());
                  showMessage(false);
                } else {
                  setFlatListItems(temp.reverse());
                  showMessage(true);
                }
              });
            })
          ],
        },
      ]
    );
  };

  useEffect(() => {
    //function for first time usage (table creation)
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_sales'",
        [],
        function (tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_sales', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_sales(product_id INTEGER PRIMARY KEY AUTOINCREMENT, product_name VARCHAR(255), url VARCHAR(50), username VARCHAR(10), password VARCHAR(20), pin INTEGER(6), cvv INTEGER(3), seller VARCHAR(20), date VARCHAR(200))',
              []
            );
          }
        }
      )
    })
    const unsubscribe = navigation.addListener('focus', () => {
      //function to create the FlatList as soon as screen mounts
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM table_sales', [], (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          if (typeof temp !== 'undefined' && temp.length > 0) {
            setFlatListItems(temp.reverse());
            showMessage(false);
          } else {
            showMessage(true);
          }
        });
      });
    });
    return unsubscribe;
  }, [navigation]);

  let listItemView = (item, index) => {
    var image;
    if (item.seller === "Flipkart") {
      image = require('../assets/img/flipkart.png');
    } else if (item.seller === "Amazon") {
      image = require('../assets/img/amazon.webp');
    }

    //we don't want delete animations for this simple app. We'll just do iOS swipe to delete
    //It'll get the job done without much complexity..
    let swipeBtns = [{
      text: 'Delete',
      component: (
        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
          <Icon name='delete' style={{ marginTop: 30 }} type='material' color='white' size={30} />
        </View>
      ),
      backgroundColor: 'red',
      underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      onPress: () => { deleteItem(item.product_id) }
    }];

    return (
      <Swipeout right={swipeBtns}
        autoClose={true}
        backgroundColor='transparent'>
        <TouchableNativeFeedback key={item.product_id} onPress={() => navigation.navigate('Sale_Elaborate', { item: item.product_id })} background={TouchableNativeFeedback.Ripple("gray")} r>
          <View style={styles.elementroot}>
            <Image
              style={styles.elementimage}
              source={image} />
            <View style={styles.elementext}>
              <Text style={styles.elementheading}>{item.product_name}</Text>
              <Text style={styles.username}>{moment(item.date).format("MMMM Do, YYYY, dddd")}</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
      </Swipeout>
    );
  };

  return (
    <View
      style={styles.root}
      contentContainerStyle={{
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {addmessage ?
        <View style={styles.addmessage}>
          <Text style={{ color: 'gray' }}>Click + to add a sale</Text>
        </View> : null}
      <FlatList
        style={{ alignSelf: 'stretch', height: 540 }}
        data={flatListItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => listItemView(item, index)}
      />
      <View style={styles.bottom}>
        <Button
          buttonStyle={[styles.buttonStyle, { backgroundColor: global.accent }]}
          onPress={() => navigation.navigate('Schedule_Sale', { placeholder: "" })}
          icon={
            <Icon name='add' type='material' size={40} color='white' />
          }
        />
      </View>
    </View>
  );
};


function Home() {
  const Stack = createStackNavigator();
  const isDarkMode = useDarkMode();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerStyle: {
            height: 110,
            backgroundColor: isDarkMode ? 'black' : 'white'
          },
          headerTitle: <Header />,
        }}
      />
      <Stack.Screen
        name="Schedule_Sale"
        component={Schedule_Sale}
        options={{
          headerStyle: {
            backgroundColor: isDarkMode ? 'black' : 'white',
          },
          headerTintColor: isDarkMode ? 'white' : 'black',
          title: "Schedule A Sale"
        }}
      />
      <Stack.Screen
        name="Sale_Elaborate"
        component={Sale_Elaborated}
        options={{
          headerStyle: {
            backgroundColor: isDarkMode ? 'black' : 'white',
          },
          headerTintColor: isDarkMode ? 'white' : 'black',
          title: "Sale Elaborated"
        }}
      />
      <Stack.Screen
        name="Core"
        component={buy}
        options={{
          headerStyle: {
            backgroundColor: isDarkMode ? 'black' : 'white',
          },
          headerTintColor: isDarkMode ? 'white' : 'black',
          title: "Buying Item"
        }}
      />
    </Stack.Navigator>
  );
}

const Dynamicstyles = new DynamicStyleSheet(styles);

export default Home;