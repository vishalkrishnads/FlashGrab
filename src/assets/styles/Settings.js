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
    sub_heading: {
        color: new DynamicValue("black", "#f2f2f2"),
        fontFamily: 'Baloo',
        fontSize: width / 25
    },
    card_root: {
        flex: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: new DynamicValue('#f2f2f2', '#333333'),
        height: '90%',
        borderRadius: 30
    },
    card_heading:{
        fontSize: height/50,
        fontFamily: 'Baloo',
        color: new DynamicValue('#737373', '#a6a6a6' ), 
    },
    card_icon:{
        fontSize: height/15,
        fontFamily: 'Baloo',
        color: new DynamicValue('#737373', '#a6a6a6' ),
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
        fontSize: height/35
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
        fontSize: width/28,
        fontFamily: 'Baloo-Bold'
    }
})