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
    gallery: {
        flex: 2.5,
        backgroundColor: new DynamicValue('#f2f2f2', '#333333'),
        borderRadius: 50,
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    item_image: {
        height: height/4,
        width: height/4,
        resizeMode: 'contain'
    },
    title:{
        fontSize: height/45,
        color: new DynamicValue('black', 'white')
    },
    datetime:{
        color: new DynamicValue('#737373', '#a6a6a6' ),
        fontSize: height/50
    },
    price:{
        color: new DynamicValue('#737373', '#a6a6a6' ),
        fontSize: height/40
    },
    seller_icon:{
        height: height/20,
        width: height/20,
        resizeMode: 'contain'
    },
    card_root:{
        flex: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: new DynamicValue('#f2f2f2', '#333333'),
        height: '90%',
        borderRadius: 30
    },
    card_heading:{
        color: new DynamicValue('#737373', '#a6a6a6' ),
        fontSize: width/25
    },
    card_icon:{
        fontSize: height/15,
        color: new DynamicValue('#737373', '#a6a6a6' ),
    },
})