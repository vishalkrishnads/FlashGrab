import { StyleSheet, Dimensions } from 'react-native'

const width = Dimensions.get('window').width
export default new StyleSheet.create({
    background: {
        width: width / 1.5,
        height: width / 1.5,
        alignItems: 'center'
    },
    background_image: {
        borderRadius: 150,
    },
    foreground: {
        height: width,
        width: width,
        resizeMode: 'stretch'
    }
})