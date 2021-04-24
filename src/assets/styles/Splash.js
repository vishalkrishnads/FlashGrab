import { Dimensions } from 'react-native'
import { DynamicStyleSheet, DynamicValue } from 'react-native-dark-mode'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
export default new DynamicStyleSheet({
    root: {
        flex: 1,
        backgroundColor: new DynamicValue('white', 'black')
    },
    start_button: {
        flex: 1,
        height: height / 15,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#036082'
    },
    start_text: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: width / 20
    },
    captions: {
        color: new DynamicValue('black', 'white')
    },
    keypad_number: {
        fontWeight: 'bold',
        color: new DynamicValue('black', 'white'),
        fontSize: width/10
    },
    placeholder:{
        flex: 1, 
        margin: width/20,
        alignItems: 'center'
    },
    bullet:{
        color: new DynamicValue('black', 'white'),
        fontWeight: 'bold',
        fontSize: width/13
    },
    hash:{
        color: new DynamicValue('black', 'white'),
        fontSize: width/10
    },
    status:{
        color: new DynamicValue('black', 'white'),
        fontWeight: 'bold',
        fontSize: width/12 
    }
})