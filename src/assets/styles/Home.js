import { Dimensions } from 'react-native'
import { DynamicStyleSheet, DynamicValue } from 'react-native-dark-mode'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
export default new DynamicStyleSheet({
    root: {
        flex: 1,
        backgroundColor: new DynamicValue('white', 'black')
    },
    logo: {
        flex: 1,
        height: height / 10,
        width: width / 3,
        resizeMode: 'stretch'
    },
    banner: {
        color: new DynamicValue('black', 'white'),
        fontSize: width / 15,
        fontWeight: 'bold'
    },
    list_container: {
        flex: 1,
        marginLeft: width / 20,
        marginRight: width / 20,
        backgroundColor: new DynamicValue('#f2f2f2', '#333333'),
        borderRadius: 50,
        justifyContent: 'center'
    },
    add_button: {
        flex: 4,
        borderRadius: 50,
        margin: height/80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    add_button_text:{
        color: 'white',
        fontSize: height/45,
    },
    item_root: {
        marginTop: 20,
        height: 100,
        marginRight: width/40,
        flexDirection: 'row'
    },
    item_image: {
        height: 90,
        width: 90,
        resizeMode: 'contain',
        // borderRadius: 200
    },
    item_title: {
        color: new DynamicValue('black', 'white'),
        fontSize: 16,
        flexWrap: 'wrap',
        fontWeight: '600'
    },
    item_price: {
        color: 'gray',
        fontWeight: '500',
        marginLeft: 5,
        fontSize: 18
    },
    seller_icon: {
        height: 35,
        width: 35,
        resizeMode: 'stretch'
    },
    instruction:{
        color: new DynamicValue('#737373', '#a6a6a6' ),
        fontSize: height/45,
        marginBottom: height/40,
        alignSelf: 'center'
    },
})