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
        fontWeight: 'bold',
        fontSize: width / 18
    },
    gallery:{
        flex: 4,
        backgroundColor: new DynamicValue('#f2f2f2', '#333333'),
        borderRadius: 25,
        marginLeft: 20,
        marginRight: 20
    },
    text_container:{
        flex: 4,
        alignItems: 'center'
    },
    text:{
        color: new DynamicValue('black', 'white'),
        fontSize: width/22,
        fontFamily: 'Baloo',
        marginBottom: height/40,
        textAlign: 'center'
    },
    modal:{
        backgroundColor: 'rgba(0,0,0,0.5)',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    selector_root:{
        backgroundColor: new DynamicValue('white', 'black'),
        width: '80%',
        height: 280,
        borderRadius: 50,
        justifyContent: 'center'
    },
    selector_heading:{
        fontFamily: 'Baloo-Bold',
        fontSize: height/40
    },
    field_container:{
        flex: 4,
        marginLeft: width/10,
        marginRight: width/10
    },
    button:{
        marginRight: 10
    },
    button_text:{
        fontSize: width/30,
        fontFamily: 'Baloo-Medium'
    },
    instruction:{
        color: new DynamicValue('#737373', '#a6a6a6' ),
        fontSize: width/30,
        fontFamily: 'Baloo',
        marginBottom: height/40
    },
    captcha:{
        resizeMode: 'contain',
        height: 50,
        width: '80%'
    }
})