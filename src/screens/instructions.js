import * as React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import { DynamicValue, DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode';
import Subheader from '../assets/Subheader';
import Indexed from '../assets/indexed';

const instructions = () => {
    const styles = useDynamicStyleSheet(DynamicStyles);
    return (
        <ScrollView style={styles.root}>
            <View style={styles.headercontainer}>
                <Icon
                    name='book'
                    type='material'
                    size={300}
                    color='grey' />
            </View>
            <View style={styles.maincontainer}>
                <Subheader text='Purpose' />
                <View style={{ marginTop: 10, marginLeft: 20, marginRight: 20 }}>
                    <Text style={styles.text}>      Today, the most prominent online seller websites hold flash sales to help brands manage their stocks effectively. Most of the good stuff goes on sale via flash sales and in the process, consumers won't be able to get their hands on them. Thereafter, in many cases, consumers are forced to pay high prices to third party dealers to get the product. These days, there are people who even make money by using automated scripts to buy the products in bulk and then sell them at high prices. Although Amazon & Flipkart have both taken measures to prevent these frauds, they find workarounds to come over it.</Text>
                    <Text style={[styles.text, { marginTop: 10 }]}>Enter FlashGrabs, a one stop solution to the problem. We aim to empower the common consumer to buy their product of choice without paying insanely high prices to any third parties. This app itself is an automated script at the core to automate the buying process. You have almost 80% more chances of getting a product in flash sales at that reduced price itself if you use FlashGrabs.</Text>
                </View>
                <Subheader text='Prerequisites' />
                <Indexed index='1.' text="You need to have an account in the seller website (Amazon and/or Flipkart) to use FlashGrabs." />
                <Indexed index='2.' text="Make sure to have removed all saved payment methods except for a debit/credit card. DO NOT remove all payment methods." />
                <Indexed index='3.' text="You also need to have the required balance in that credit/debit card for the item that you're going to buy." />
                <Subheader text='How To Use' />
                <Indexed index='1.' text="First of all, it's recommended to set up the app lock as you're giving in your account credentials for your seller accounts and we don't want anyone messing with your phone and taking those when you're away." />
                <Indexed index='2.' text="To schedule a sale, click on the '+' button that you'll see when you first start the app." />
                <Indexed index='3.' text="Enter in the details of the sale. If you're worried about giving in personal details such as the account username and password for the seller account, then check out our privacy policy and terms of service from the app settings to know more about it." />
                <Indexed index='4.' text="Even if the credentials are incorrect, the system WILL NOT notify you. During the sale, it will try those and if it fails, it'll prompt you to login manually. Do note that this consumes more time and thereby reduces your chances of grabbing the product" />
                <Indexed index='5.' text="Once a sale is scheduled, you can leave the app and continue using your phone normally." />
                <Indexed index='6.' text="When the time's up, you'll recieve a notification from FlashGrabs. Click on it to get back in." />
                <Indexed index='7.' text="Once you get back in, start the sale immediately. The app will take a few seconds to load some scripts and get ready." />
                <Indexed index='8.' text="From here on, everything should happen automatically, unless your account credentials weren't correct." />
                <Indexed index='9.' text="FlashGrabs, however, does give you a chance to make a final decision regarding the purchase. Once the payment is initiated, you'll be sent to your bank's webpage to enter the OTP you recieved. You can click the cancel button to quit the sale then or enter the OTP to proceed." />
                <Indexed index='  ' text="NOTE: At FlashGrabs, we value your privacy too. We neither record your card details nor use the OTP received to make unauthorised transactions. Refer to our privacy policy for more details." />
                <Indexed index='10.' text="Once a sale is completed, FlashGrabs immediately deletes all the data related to that sale. Not even a purchase history will be recorded. However, you warranty claims and the bill can be found within the seller's mobile app/website as usual." />
            </View>
            <View style={styles.footer}>
                <Text style={{ color: 'grey' }}>&copy; FlashGrabs 2020. All rights reserved.</Text>
            </View>
        </ScrollView>
    );
}

const width = Dimensions.get('window').width;
const DynamicStyles = new DynamicStyleSheet({
    root: {
        flex: 1,
        backgroundColor: new DynamicValue('white', 'black')
    },
    headercontainer: {
        alignItems: 'center',
        backgroundColor: new DynamicValue('#cccccc', '#404040')
    },
    maincontainer: {
        marginTop: 10
    },
    text: {
        fontSize: 15,
        color: new DynamicValue('black', 'white')
    },
    footer: {
        marginTop: 20,
        marginBottom: 10,
        alignItems: 'center',
    }
})

export default instructions;