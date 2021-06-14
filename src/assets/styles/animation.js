import { StyleSheet, Dimensions } from 'react-native'

const width = Dimensions.get('window').width
export default new StyleSheet.create({
    background_image: {
        borderRadius: 150,
    },
    logo: {
        height: Dimensions.get('window').height/2,
        width: Dimensions.get('window').width/2,
        resizeMode: 'contain'
    }
})