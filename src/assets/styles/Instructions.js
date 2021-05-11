import { Dimensions } from 'react-native'
import { DynamicStyleSheet, DynamicValue } from 'react-native-dark-mode'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
export default new DynamicStyleSheet({
    root:{
        flex: 1,
        backgroundColor: new DynamicValue('white', 'black')
    },
    heading:{
        color: new DynamicValue('black', 'white'),
        fontWeight: 'bold',
        fontSize: width/18
    },
    gallery:{
        flex: 1.5,
        backgroundColor: new DynamicValue('#f2f2f2', '#333333'),
        borderRadius: 25,
        marginLeft: 20,
        marginRight: 20
    },
    button:{
        flex: 4,
        height: 'auto',
        width: width/8,
        marginRight: width/30,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7
    },
    button_text:{
        color: 'white',
        margin: 5,
        fontSize: height/40
    },
    welcome_icon:{
        fontSize: height/8,
        color: new DynamicValue('#737373', '#a6a6a6' ),
    },
    text:{
        color: new DynamicValue('black', 'white'),
        fontSize: height/45,
        textAlign: 'center'
    },
    image: {
        height: height/1.5,
        width: width/2,
        resizeMode: 'contain'
    },
    copyright:{
        color: new DynamicValue('#737373', '#a6a6a6' ),
    }
})