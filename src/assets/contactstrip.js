import * as React from 'react';
import { View, Linking } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import Subheader from './Subheader';

const ContactUs = () => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 6 }}>
                <Subheader text="Contact Us" />
            </View>
            <View style={{ flex: 1.5 }}>
                <Button
                    onPress={() => Linking.openURL('https://flash-grab.web.app/#mail')}
                    buttonStyle={{ backgroundColor: 'transparent' }}
                    icon={
                        <Icon name='public' type='material' size={30} color='gray' />
                    }></Button>
            </View>
            <View style={{ flex: 1.5 }}>
                <Button
                    onPress={() => Linking.openURL('mailto:321vishalds@gmail.com')}
                    buttonStyle={{ backgroundColor: 'transparent' }}
                    icon={
                        <Icon name='email' type='material' size={30} color='gray' />
                    }></Button>
            </View>
            <View style={{ flex: 1.5 }}>
                <Button
                    onPress={() => Linking.openURL('tel:+91 9074775013')}
                    buttonStyle={{ backgroundColor: 'transparent' }}
                    icon={
                        <Icon name='local-phone' type='material' size={30} color='gray' />
                    }></Button>
            </View>
        </View>
    );
}

export default ContactUs; 