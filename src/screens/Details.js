import React from 'react'
import { View, Text, Alert, TouchableOpacity, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDynamicStyleSheet } from 'react-native-dark-mode'
import { openDatabase } from 'react-native-sqlite-storage'
import MarqueeText from 'react-native-marquee'
import FastImage from 'react-native-fast-image'
import EvilIcon from 'react-native-vector-icons/EvilIcons'
import Materialicon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import FlashGrabIcon from 'react-native-vector-icons/AntDesign'
import dynamicStyles from '../assets/styles/Details'
import { KEYS } from '@env'

var CryptoJS = require("crypto-js");
var db = openDatabase({ name: 'FlashGrab.db' });
var moment = require('moment');
const Details = ({ route, navigation }) => {
    const { item } = route.params
    const styles = useDynamicStyleSheet(dynamicStyles)
    let [data, set_data] = React.useState({})
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM sales where product_id = ?',
                    [item],
                    (tx, results) => {
                        var len = results.rows.length;
                        if (len > 0) {
                            set_data(results.rows.item(0))
                        } else {
                            Alert.alert('No such item enrolled');
                        }
                    }
                );
            });
        });
        return unsubscribe;
    }, [route, navigation])

    const decrypt = (cipher) => {
        try {
            var bytes = CryptoJS.AES.decrypt(cipher, KEYS)
            return bytes.toString(CryptoJS.enc.Utf8)
        } catch {
            return cipher
        }
    }

    const Card = ({ icon, heading, onpress }) => {
        return (
            <TouchableOpacity style={[styles.card_root, { backgroundColor: heading === "Buy Now" ? global.accent : styles.card_root.backgroundColor }]} onPress={onpress}>
                <View style={{ flex: 1 }}></View>
                <View style={{ flex: 4, alignItems: 'flex-start' }}>
                    <View style={{ flex: 3, flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}></View>
                        <View style={{ flex: 4, justifyContent: 'flex-end' }}>
                            {icon}
                        </View>
                        <View style={{ flex: 4 }}></View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1 }}></View>
                        <View style={{ flex: 4 }}>
                            <MarqueeText
                                style={[styles.card_heading, { color: heading === "Buy Now" ? 'white' : styles.card_heading.color }]}
                                duration={3000}
                                marqueeOnStart
                                loop
                                marqueeDelay={1000}
                                marqueeResetDelay={3000}
                            >{heading}</MarqueeText>
                        </View>
                        <View style={{ flex: 1.5 }}></View>
                    </View>
                </View>
                <View style={{ flex: 1 }}></View>
            </TouchableOpacity>
        );
    }

    const payment_icon = {
        'UPI': <Materialicon name={'contactless-payment'} style={styles.card_icon} />,
        'Card': <MaterialIcon name={'payment'} style={styles.card_icon} />,
        'COD': <MaterialIcon name={'delivery-dining'} style={styles.card_icon} />,
    }

    return (
        <SafeAreaView style={styles.root}>
            <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.heading}>Sale Details</Text>
            </View>
            <View style={{ flex: 8 }}>
                <View style={styles.gallery}>
                    <FastImage
                        source={{ uri: data.image }}
                        style={styles.item_image}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </View>
                <View style={{ flex: 5 }}>
                    <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center', marginLeft: 10, marginRight: 10 }}>
                        <MarqueeText
                            style={styles.title}
                            duration={3000}
                            marqueeOnStart
                            loop
                            marqueeDelay={1000}
                            marqueeResetDelay={3000}
                        >{data.title}</MarqueeText>
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 0.8 }}></View>
                            <View style={{ flex: 12, flexDirection: 'row' }}>
                                <Text style={styles.datetime}>{moment(Date.parse(data.date)).format("dddd, MMMM Do, YYYY")}</Text>
                                <Text style={styles.datetime}>{moment(Date.parse(data.date)).format(" | h:mm a").toUpperCase()}</Text>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={{ flex: 0.8 }}></View>
                            <View style={{ flex: 12, flexDirection: 'row', alignItems: 'center' }}>
                                <FastImage
                                    source={data.seller === "Amazon" ? require('../assets/img/amazon.webp') : require('../assets/img/flipkart.png')}
                                    style={styles.seller_icon}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                                <Text style={styles.price}> &#8377;{data.price}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 3, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}></View>
                        <Card heading={data.payment_method} icon={payment_icon[data.payment_method]} />
                        <View style={{ flex: 1 }}></View>
                        <Card heading={'View in store'} icon={<EvilIcon name={'external-link'} style={styles.card_icon} />} onpress={() => Linking.openURL(data.url)} />
                        <View style={{ flex: 1 }}></View>
                    </View>
                    <View style={{ flex: 3, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}></View>
                        <Card heading={decrypt(data.username)} icon={<Materialicon name={'account'} style={styles.card_icon} />} />
                        <View style={{ flex: 1 }}></View>
                        <Card heading={'Buy Now'} onpress={() => navigation.navigate('Purchase_Engine', { data: data })} icon={<FlashGrabIcon name={'shoppingcart'} style={[styles.card_icon, { color: 'white' }]} />} />
                        <View style={{ flex: 1 }}></View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Details