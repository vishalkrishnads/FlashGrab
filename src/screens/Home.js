import React from 'react'
import { View, Text, Image, Alert, FlatList, TouchableOpacity, TouchableNativeFeedback, Share } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDynamicStyleSheet, useDarkMode } from 'react-native-dark-mode'
import { openDatabase } from 'react-native-sqlite-storage';
import ShareMenu from 'react-native-share-menu';
import FastImage from 'react-native-fast-image'
import EncryptedStorage from 'react-native-encrypted-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'
import dynamicStyles from '../assets/styles/Home'
import Swipeout from 'react-native-swipeout';

var db = openDatabase({ name: 'FlashGrab.db' });
const Home = ({ navigation }) => {
    const styles = useDynamicStyleSheet(dynamicStyles)
    const isDarkMode = useDarkMode()
    let [listitems, set_listitems] = React.useState([])

    const handleShare = React.useCallback((item) => {
        if (!item) {
            return;
        }
        else {
            navigation.navigate("AddSale", { placeholder: String(item.data.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig)) })
        };
        []
    });
    React.useEffect(() => {
        ShareMenu.getInitialShare(handleShare);
    }, []);
    React.useEffect(() => {
        ShareMenu.addNewShareListener(handleShare);
    }, []);

    React.useEffect(() => {
        var header = new Headers()
        header.set('Cache-Control', 'no-cache');
        header.set('Pragma', 'no-cache');
        header.set('Expires', '0');
        fetch('https://flashgrab.firebaseapp.com/cdn/data/notice.json', { headers: header })
            .then((response) => response.json())
            .then(async (json) => {
                if (await EncryptedStorage.getItem("notice") !== null) {
                    json.forEach(async (element) => {
                        if (element.index > parseInt(await EncryptedStorage.getItem("notice"))) {
                            Alert.alert(element.heading, element.content)
                            await EncryptedStorage.setItem("notice", element.index.toString())
                        }
                    });
                } else {
                    json.forEach(async (element) => {
                        Alert.alert(element.heading, element.content)
                        await EncryptedStorage.setItem("notice", element.index.toString())
                    });
                }
            }).catch()
    }, [])

    React.useEffect(() => {
        //function for first time usage (table creation)
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='sales'",
                [],
                function (tx, res) {
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS sales', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS sales(product_id INTEGER PRIMARY KEY AUTOINCREMENT, url VARCHAR(50), username VARCHAR(10), password VARCHAR(20), payment_method VARCHAR(4), payment_data VARCHAR(255), pin_code INTEGER(7), seller VARCHAR(20), date VARCHAR(200), title VARCHAR(255), price VARCHAR(200), image VARCHAR(4000))',
                            []
                        );
                    }
                }
            )
        })
        const unsubscribe = navigation.addListener('focus', () => {
            //function to create the FlatList as soon as screen mounts
            db.transaction((tx) => {
                tx.executeSql('SELECT * FROM sales', [], (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i)
                        temp.push(results.rows.item(i));
                    if (typeof temp !== 'undefined' && temp.length > 0) {
                        set_listitems(temp.reverse());
                    }
                });
            });
        });
        return unsubscribe;
    }, [navigation]);

    const deleteItem = (id, name) => {
        Alert.alert(
            'Confirm Delete',
            `Do you surely want to delete the sale of ${name}`,
            [
                { text: 'Cancel', style: 'cancel', onPress: () => { } },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => [
                        db.transaction((tx) => {
                            tx.executeSql(
                                'DELETE FROM sales WHERE product_id=?',
                                [id],
                            );
                        }),
                        db.transaction((tx) => {
                            tx.executeSql('SELECT * FROM sales', [], (tx, results) => {
                                var temp = [];
                                for (let i = 0; i < results.rows.length; ++i)
                                    temp.push(results.rows.item(i));
                                if (typeof temp !== 'undefined' && temp.length > 0) {
                                    set_listitems(temp.reverse());
                                }
                            });
                        })
                    ],
                },
            ]
        );
    };

    const renderItem = ({ item }) => {
        let swipeBtns = [{
            text: 'Delete',
            component: (
                <View style={styles.delete_container}>
                    <Icon name='delete' color='white' size={30} />
                </View>
            ),
            backgroundColor: 'red',
            underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
            onPress: () => { deleteItem(item.product_id, item.title) }
        }];
        return (
            <Swipeout right={swipeBtns}
                autoClose={true}
                backgroundColor='transparent'>
                <TouchableNativeFeedback key={item.product_id} onPress={() => navigation.navigate('Details', { item: item.product_id })} background={TouchableNativeFeedback.Ripple(global.accent)} r>
                    <View style={styles.item_root}>
                        <View style={styles.item_image_container}>
                            <FastImage
                                style={styles.item_image}
                                source={{
                                    uri: item.image,
                                    priority: FastImage.priority.high,
                                }}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                        </View>
                        <View style={{ flex: 7 }}>
                            <View style={{ flex: 1 }}><Text style={styles.item_title}>{item.title}</Text></View>
                            <View style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center' }}>
                                <FastImage
                                    source={item.seller === "Amazon" ? require('../assets/img/amazon.webp') : require('../assets/img/flipkart.png')}
                                    style={styles.seller_icon}
                                    resizeMode={FastImage.resizeMode.stretch}
                                />
                                <Text style={styles.item_price}>&#8377; {item.price}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>
            </Swipeout>
        );
    }
    return (
        <SafeAreaView style={styles.root}>
            <View style={{ flex: 1.5 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flex: 1.5 }}></View>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Image
                                source={isDarkMode ? require('../assets/img/dark.png') : require('../assets/img/light.png')}
                                style={styles.logo}
                            />
                        </View>
                        <View style={{ flex: 4, justifyContent: 'flex-end', marginLeft: global.width / 20, marginTop: global.height / 40 }}>
                            <Text style={styles.banner}>FlashGrab</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}></View>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={async () => await Share.share({
                            message:
                                `Hey there, check out FlashGrab. An amazing app for grabbing your favourite things in a flash sale.
                                        https://flashgrab.github.io`,
                        })}><Icon name="share" size={global.width / 15} color={'gray'} /></TouchableOpacity>
                    </View>
                    <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.navigate("Settings")}><Icon name="settings" size={global.width / 15} color={'gray'} /></TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{ flex: 10, justifyContent: 'center' }}>
                {listitems.length === 0 ?
                    <View style={[styles.float_button_heights, { justifyContent: 'center' }]}>
                        <Text style={styles.instruction}>Schedule your flash sales to see them here</Text>
                        <Text style={styles.instruction}>Check settings for instructions</Text>
                    </View>
                    : <FlatList
                        data={listitems}
                        style={[styles.float_button_heights, { alignSelf: 'stretch', marginLeft: 20, marginRight: 10 }]}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />}
                <View style={{ height: 1, alignSelf: 'center', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.navigate("AddSale", { placeholder: '' })} style={[styles.add_button, { backgroundColor: global.accent }]}>
                        <Icon name="add" color={'white'} size={global.width / 10} />
                        <Text style={styles.add_button_text}>Schedule Sale</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* <View style={{ flex: 1.2, flexDirection: 'row' }}>
                <View style={{ flex: 2 }}></View>
                
                <View style={{ flex: 2 }}></View>
            </View> */}
        </SafeAreaView>
    );
}

export default Home