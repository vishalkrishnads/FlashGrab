import React from 'react'
import { View, Text, Image, Dimensions, FlatList, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDynamicStyleSheet } from 'react-native-dark-mode'
import { openDatabase } from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'
import dynamicStyles from '../assets/styles/Home'

var db = openDatabase({ name: 'FlashGrab.db' });
const Home = ({ navigation }) => {
    const width = Dimensions.get('window').width
    const styles = useDynamicStyleSheet(dynamicStyles)
    let [listitems, set_listitems] = React.useState([])

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
                            'CREATE TABLE IF NOT EXISTS sales(product_id INTEGER PRIMARY KEY AUTOINCREMENT, url VARCHAR(50), username VARCHAR(10), password VARCHAR(20), payment_method VARCHAR(4), payment_data VARCHAR(255), seller VARCHAR(20), date VARCHAR(200), title VARCHAR(255), price VARCHAR(200), image VARCHAR(4000))',
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
                    } else {
                    }
                });
            });
        });
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }) => {
        return (
            <View style={styles.item_root}>
                <View style={{ flex: 3, alignItems: 'center' }}>
                    <Image
                        source={{ uri: item.image }}
                        style={styles.item_image}
                    />
                </View>
                <View style={{ flex: 7 }}>
                    <View style={{ flex: 1 }}><Text style={styles.item_title}>{item.title}</Text></View>
                    <View style={{ flex: 1.5, flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={item.seller === "Amazon" ? require('../assets/img/amazon.webp') : require('../assets/img/flipkart.png')}
                            style={styles.seller_icon}
                        />
                        <Text style={styles.item_price}>&#8377; {item.price}</Text>
                    </View>
                </View>
            </View>
        );
    }
    return (
        <SafeAreaView style={styles.root}>
            <View style={{ flex: 1.5 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Image
                                source={require('../assets/img/foreground.png')}
                                style={styles.logo}
                            />
                        </View>
                        <View style={{ flex: 2, alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: width / 20 }}>
                            <Text style={styles.banner}>FlashGrab</Text>
                        </View>
                    </View>
                    <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.navigate("Settings")}><Icon name="settings" size={width / 15} color={'gray'} /></TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{ flex: 10 }}>
                <View style={styles.list_container}>
                    {listitems.length === 0 ?
                        <Text style={styles.instruction}>Schedule your flash sales to see them here</Text>
                        : <FlatList
                            data={listitems}
                            style={{ marginBottom: 10, marginLeft: 10 }}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                        />}
                </View>
            </View>
            <View style={{ flex: 1.2, flexDirection: 'row' }}>
                <View style={{ flex: 2 }}></View>
                <TouchableOpacity onPress={() => navigation.navigate("AddSale")} style={[styles.add_button, { backgroundColor: global.accent }]}>
                    <Icon name="add" color={'white'} size={width / 10} />
                    <Text style={styles.add_button_text}>Schedule Sale</Text>
                </TouchableOpacity>
                <View style={{ flex: 2 }}></View>
            </View>
        </SafeAreaView>
    );
}

export default Home