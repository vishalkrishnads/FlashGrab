import * as React from 'react'
import { View, Text } from 'react-native'
import { useDarkMode } from 'react-native-dark-mode'

function Header() {
    const isDarkmode = useDarkMode();
    return (
        <View style={{backgroundColor: isDarkmode?'black':'white'}}>
            <View>
                <Text style={{fontSize: 30, fontWeight: 'bold', color: isDarkmode?'white':global.accent}}>FlashGrab</Text>
            </View>
        </View>
    );
}

export default Header