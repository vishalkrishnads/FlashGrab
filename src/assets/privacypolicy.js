import * as React from 'react';
import { ScrollView, View, Text, Linking } from 'react-native';
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dark-mode';
import styles from './styles';
import Indexed from './indexed';
import Subheader from './Subheader';
import ContactUs from './contactstrip';

const PrivacyPolicy = () => {
    const style = useDynamicStyleSheet(new DynamicStyleSheet(styles));
    return (
        <ScrollView style={style.root}>
            <Text style={style.heading}>FlashGrab Privacy Policy</Text>
            <View style={[style.paragraph, { marginBottom: 5, marginTop: 0 }]}>
                <Text style={style.texts}>       FlashGrab is a service which enables users to confidently and effectively purchase products during flash sales. "FlashGrab" or "we" or "us" refers to the developer of FlashGrab, Vishal Krishna DS, in this privacy policy.</Text>
                <Text style={style.texts}>       Privacy Policy applies whenever you use the official FlashGrab android app, visit the FlashGrab site, or any other domain(s) we own. This privacy policy describes:</Text>
            </View>
            <Indexed index="•" text="what information we collect, how we collect them, and why" />
            <Indexed index="•" text="how we use that information and with whom we share it" />
            <Indexed index="•" text="the choices you can make about how we collect, use & share your information" />
            <Indexed index="•" text="how we protect the information we store about you" />
            <View style={style.paragraph}>
                <Text style={style.texts}>      If you do not want FlashGrab to collect, store or use your information as described in this privacy policy, you may not use the FlashGrab service and/or it's affiliate website. This privacy policy does not, under any circumstances, apply to any modded version of the FlashGrab app which has been built from our source code.</Text>
            </View>
            <Subheader text="Information We Collect" />
            <View style={style.paragraph}>
                <Text style={style.texts}>FlashGrab collects and handles very sensitive data from you. We collect:</Text>
            </View>
            <Indexed index="•" text="your Amazon and/or Flipkart username and password to log in to your account to place an order during a flash sale" />
            <Indexed index="•" text="your debit card's CVV/CVC number to use during the purchase" />
            <Indexed index="•" text="the OTP you receive from your bank during the transaction" />
            <Subheader text="How do we collect information?" />
            <View style={style.paragraph}>
                <Text style={style.texts}>      We collect all the above mentioned data with your full consent. You have to voluntarily provide all this data when you are scheduling a sale using our android app.</Text>
            </View>
            <Subheader text="Use of your information" />
            <Indexed index="•" text="We use your account username and password for logging into your account in our server. We delete your password after logging in, and store your username along with your purchase status for reference during any future disputes that may arise." />
            <Indexed index="•" text="During a flash sale purchase, it is also vital to make fast payments to ensure that you get you order placed. And this is why we collect your debit card's CVV."/>
            <Indexed index="•" text="We also request the OTP that you receive from your bank for the transaction. This is to attempt the payment automatically. Meanwhile, it is also worth noting that we do not have support for all prominent banks' OTP collection forms and it is quite common that entering the OTP may fail. However, we also delete that data after attempting to make payment." />
            <Indexed index="•" text="Your username, however, is stored in our server. This is for logging and banning purposes. Under certain circumstances, we may be forced to block you and/or your device from using/running FlashGrab. We use your username to log and do so accordingly. You can read more about getting banned in the Terms of Use." />
            <Indexed index="•" text="Your username, henceforth, is also used as a medium to comply with our legal obligations." />
            <Subheader text="Children Under the age of 13" />
            <View style={style.paragraph}>
                <Text style={style.texts}>      FlashGrab isn't intended for use by children under the age of 13. We do not knowingly collect any information from children under the age of 13. If you are under the age of 13, please do not use FlashGrab.</Text>
            </View>
            <Subheader text="Communication Policy" />
            <View style={style.paragraph}>
                <Text style={style.texts}>      We do not use any of the data we collect from you for sending promotional messages and/or emails. However, when you contact our customer helpline through WhatsApp, we will store your chats with our representative for future reference.</Text>
            </View>
            <Subheader text="Business Transfers, Combinations & Related activities" />
            <View style={style.paragraph}>
                <Text style={style.texts}>      If you are using FlashGrab, we will not store, sell, rent or swap any of your personal information without your proper consent.</Text>
            </View>
            <Subheader text="Dispute Resolution" />
            <View style={style.paragraph}>
                <Text style={style.texts}>       If you have any complaints regarding our compliance with this privacy policy, you should first contact us. We will investigate and attempt to solve complaints and disputes regarding use and disclosure of personal information in accordance with this privacy policy.</Text>
                <Text style={style.texts}>      Any unresolved privacy issue and/or dispute comes under the legal jurisdiction of the Indian law. You may invoke legal procedures once and only once all other dispute resolution methods have been exhausted.</Text>
            </View>
            <Subheader text="Changes to the Privacy Policy" />
            <View style={style.paragraph}>
                <Text style={style.texts}>      We won't directly notify you of the changes in this privacy policy. However, this will always be available in the android app settings and the footer of all websites in the domains registered in our name.</Text>
            </View>
            <ContactUs />
            <View style={style.paragraph}>
                <Text style={style.texts}>      If you have a question, dispute or issue about this privacy policy, you can contact us by:</Text>
            </View>
            <Indexed index="•" text="using the contact form in our website" />
            <Indexed index="•" text="sending an email to 321vishalds@gmail.com" />
            <Indexed index="•" text="calling on the phone number +91 90747 75013" />
            <Indexed index="•" text="sending a postal mail to: Sindhu Nivas, TC 28/2786, KRA C-18, Chettikulangara, Thiruvananthapuram, Kerala, India - 695001" />
            <View style={[style.paragraph, { marginBottom: 10 }]}>
                <Text style={style.texts}>      All FlashGrab services are delivered to you assuming that you have read and agreed to the Terms Of Use & this Privacy Policy.</Text>
                <View style={{ alignSelf: "center" }}><Text style={style.texts}>Happy FlashGrabbing!!</Text></View>
            </View>
        </ScrollView>
    );
}

export default PrivacyPolicy;