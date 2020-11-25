/*Settings Screen for FlashGrab
Split more screens if necessary */

import * as React from 'react';
import { ScrollView, Linking, Share, TouchableNativeFeedback, View, Image } from 'react-native';
import { Text } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import {Picker} from '@react-native-picker/picker';
import { Icon } from 'react-native-elements';
import { DynamicStyleSheet, useDynamicStyleSheet, useDarkMode } from 'react-native-dark-mode';
import AndroidOpenSettings from 'react-native-android-open-settings';
import Subheader from '../assets/Subheader';
import applock from './applock';
import instructions from './instructions';
import styles from '../assets/styles'
import Terms from '../assets/terms';
import PrivacyPolicy from '../assets/privacypolicy';

const SettingStack = createStackNavigator();
function settingshome({ navigation }) {
  let [color, setColor] = React.useState('Flashy Blue')
  const styles = useDynamicStyleSheet(Dynamicstyles);
  return (
    <ScrollView style={[styles.root, { flex: null }]} showsVerticalScrollIndicator={false}>
      <Subheader text={'App Settings'} />
      <View style={{ flex: 3, justifyContent: 'flex-start' }}>
        <TouchableNativeFeedback onPress={() => navigation.navigate('Instructions')} background={TouchableNativeFeedback.Ripple('gray')} r>
          <View style={styles.settingselement}>
            <View style={{ flex: 1 }}>
              <Icon style={styles.settingsicons} name='book' type='material' size={35} color={'gray'} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.settingstexts}>Instructions</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={() => AndroidOpenSettings.displaySettings()} background={TouchableNativeFeedback.Ripple('gray')} r>
          <View style={styles.settingselement}>
            <View style={{ flex: 1 }}>
              <Icon style={styles.settingsicons} name='brightness-6' type='material' size={35} color={'gray'} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.settingstexts}>Theme</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
        <View style={styles.settingselement}>
          <View style={{ flex: 1 }}>
            <Icon style={styles.settingsicons} name='brightness-6' type='material' size={35} color={'gray'} />
          </View>
          <View style={{ flex: 3 }}>
            <Text style={styles.settingstexts}>Accent Colour</Text>
          </View>
          <View style={{ flex: 3 }}>
            <Picker
              selectedValue={color}
              mode='dropdown'
              style={{height: 50, width: 150, marginTop: 5}}
              onValueChange={(itemValue) =>
                setColor(itemValue)
              }>
              <Picker.Item label="Flashy Blue" value="blue" />
              <Picker.Item label="Red" value="red" />
            </Picker>
          </View>
        </View>
        <TouchableNativeFeedback onPress={() => navigation.navigate('applock')} background={TouchableNativeFeedback.Ripple('gray')} r>
          <View style={styles.settingselement}>
            <View style={{ flex: 1 }}>
              <Icon style={styles.settingsicons} name='lock' type='material' size={35} color={'gray'} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.settingstexts}>App Lock</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
      </View>
      <View style={{flex: 1, justifyContent: 'flex-start'}}>
        <Subheader text="Contact Us"/>
        <TouchableNativeFeedback onPress={() => Linking.openURL('https://api.whatsapp.com/send?phone=919074775013&text=Hi%20FlashGrab%20support.%20I%20have%20some%20queries%20regarding%20the%20app%20and%20am%20contacting%20you%20for%20the%20the%20same.')} background={TouchableNativeFeedback.Ripple('gray')} r>
          <View style={styles.settingselement}>
            <View style={{ flex: 1 }}>
              <Icon style={styles.settingsicons} name='chat-bubble' type='material' size={35} color={'gray'} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.settingstexts}>Chat with support</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={() => Linking.openURL('https://instagram.com/flashgrab')} background={TouchableNativeFeedback.Ripple('gray')} r>
          <View style={styles.settingselement}>
            <View style={{ flex: 1 }}>
                <Image
                  style={{width: 30, height: 30, marginTop: 15, marginLeft: 20}}
                  source={require('../assets/img/Instagram.png')}
                />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.settingstexts}>Follow us on Instagram</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('gray')} onPress={() => Linking.openURL("https://flashgrab.github.io")}>
          <View style={styles.settingselement}>
            <View style={{ flex: 1 }}>
              <Icon style={styles.settingsicons} name='public' type='material' color={'gray'} size={35} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.settingstexts}>Visit website</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('gray')} onPress={() => Linking.openURL("mailto:321vishalds@gmail.com")}>
          <View style={styles.settingselement}>
            <View style={{ flex: 1 }}>
              <Icon style={styles.settingsicons} name='contact-mail' type='material' color={'gray'} size={30} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.settingstexts}>Developer Contact</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-start' }}>
        <Subheader text="About" />
        <TouchableNativeFeedback onPress={async()=>{await Share.share({ title: "Share FlashGrab", message: "Hey there, have you been frustrated by flash sales? I'm now loving flash sales because of this. Try it: https://flashgrab.github.io/" })}} background={TouchableNativeFeedback.Ripple('gray')} r>
          <View style={styles.settingselement}>
            <View style={{ flex: 1 }}>
              <Icon style={styles.settingsicons} name='share' type='material' size={35} color={'gray'} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.settingstexts}>Share FlashGrab</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={() => Linking.openSettings()} background={TouchableNativeFeedback.Ripple('gray')} r>
          <View style={styles.settingselement}>
            <View style={{ flex: 1 }}>
              <Icon style={styles.settingsicons} name='android' type='material' size={35} color={'gray'} />
            </View>
            <View style={{ flex: 5.5 }}>
              <Text style={styles.settingstexts}>App Info</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={() => navigation.navigate('Terms')} background={TouchableNativeFeedback.Ripple('gray')} r>
          <View style={styles.settingselement}>
            <View style={{ flex: 1 }}>
              <Icon style={styles.settingsicons} name='help-outline' type='material' size={35} color={'gray'} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.settingstexts}>Terms Of Service</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={() => navigation.navigate('Privacy')} background={TouchableNativeFeedback.Ripple('gray')} r>
          <View style={styles.settingselement}>
            <View style={{ flex: 1 }}>
              <Icon style={styles.settingsicons} name='security' type='material' size={35} color={'gray'} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.settingstexts}>Privacy Policy</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={() => Linking.openURL("https://github.com/vishal-ds/FlashGrab")} background={TouchableNativeFeedback.Ripple('gray')} r>
          <View style={styles.settingselement}>
            <View style={{ flex: 1 }}>
              <Icon style={styles.settingsicons} name='developer-mode' type='material' size={35} color={'gray'} />
            </View>
            <View style={{ flex: 6 }}>
              <Text style={styles.settingstexts}>Source Code</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
      </View>
    </ScrollView>
  );
}

const termsofuse = () => {
  return (
    <Terms />
  );
}

const privacypolicy = () => {
  return (
    <PrivacyPolicy />
  );
}

function Settings() {
  const isDarkMode = useDarkMode();
  return (
    <SettingStack.Navigator>
      <SettingStack.Screen
        name="Settings"
        component={settingshome}
        options={{
          headerStyle: {
            backgroundColor: isDarkMode ? 'black' : 'white',
          },
          animationEnabled: false,
          headerTintColor: isDarkMode ? 'white' : 'black',
        }}
      />
      <SettingStack.Screen
        name="applock"
        component={applock}
        options={{
          headerStyle: {
            backgroundColor: isDarkMode ? 'black' : 'white',
          },
          animationEnabled: false,
          headerTintColor: isDarkMode ? 'white' : 'black',
          title: "App Lock"
        }}
      />
      <SettingStack.Screen
        name="Instructions"
        component={instructions}
        options={{
          headerStyle: {
            backgroundColor: isDarkMode ? 'black' : 'white',
          },
          animationEnabled: false,
          headerTintColor: isDarkMode ? 'white' : 'black',
        }} />
      <SettingStack.Screen
        name="Terms"
        component={termsofuse}
        options={{
          headerStyle: {
            backgroundColor: isDarkMode ? 'black' : 'white',
          },
          animationEnabled: false,
          headerTintColor: isDarkMode ? 'white' : 'black',
          title: "Terms Of Use"
        }}
      />
      <SettingStack.Screen
        name="Privacy"
        component={privacypolicy}
        options={{
          headerStyle: {
            backgroundColor: isDarkMode ? 'black' : 'white',
          },
          animationEnabled: false,
          headerTintColor: isDarkMode ? 'white' : 'black',
          title: "Privacy Policy"
        }}
      />
    </SettingStack.Navigator>
  );
}

const Dynamicstyles = new DynamicStyleSheet(styles);

export default Settings;