import { Dimensions } from 'react-native'
import { DynamicStyleSheet, DynamicValue } from 'react-native-dark-mode'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
export default new DynamicStyleSheet({
    root: {
        flex: 1,
        backgroundColor: new DynamicValue('white', 'black')
    },
    heading: {
        color: new DynamicValue('black', 'white'),
        fontFamily: 'Baloo-Bold',
        fontSize: width / 17
    },
    gallery: {
        flex: 1.5,
        backgroundColor: new DynamicValue('#f2f2f2', '#333333'),
        borderRadius: 25,
        marginLeft: 20,
        marginRight: 20
    },
    button: {
        flex: 4,
        height: 'auto',
        width: width / 8,
        marginRight: width / 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7
    },
    button_text: {
        color: 'white',
        margin: 5,
        fontSize: height / 40,
        fontFamily: 'Baloo-Medium'
    },
    welcome_icon: {
        fontSize: height / 8,
        color: new DynamicValue('#737373', '#a6a6a6'),
    },
    text_container: {
        flex: 2,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginLeft: width/10
    },
    text: {
        color: new DynamicValue('black', 'white'),
        fontSize: height < 600 ? height / 45 : width / 25,
        textAlign: 'center',
        fontFamily: 'Baloo'
    },
    image: {
        height: '90%',
        width: width / 2
    },
    copyright: {
        color: new DynamicValue('#737373', '#a6a6a6'),
        fontFamily: 'Baloo'
    }
})