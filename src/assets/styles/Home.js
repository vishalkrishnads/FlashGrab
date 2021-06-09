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
        height: new DynamicValue(height / 15, height / 10),
        width: new DynamicValue(width / 6, width / 3),
        resizeMode: 'contain'
    },
    rough_style: {
        height: height / 10,
        width: width / 3,
        resizeMode: 'contain'
    },
    banner: {
        color: new DynamicValue('#036082', 'white'),
        fontSize: width / 15,
        fontFamily: 'Baloo-Bold'
    },
    list_container: {
        flex: 1,
        marginLeft: width / 20,
        marginRight: width / 20,
        backgroundColor: new DynamicValue('#f2f2f2', '#333333'),
        borderBottomEndRadius: 25,
        borderBottomStartRadius: 25,
        justifyContent: 'center'
    },
    float_button_heights:{
        height: height/1.2
    },
    add_button: {
        alignSelf: 'center',
        height: height/12,
        width: width/2,
        marginBottom: height/10,
        borderRadius: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    add_button_text: {
        color: 'white',
        fontSize: height / 35,
        fontFamily: 'Baloo',
    },
    item_root: {
        marginTop: 20,
        height: 100,
        marginRight: width / 34,
        flexDirection: 'row'
    },
    item_image: {
        height: 90,
        width: 90,
        // borderRadius: 200
    },
    item_title: {
        color: new DynamicValue('black', 'white'),
        fontSize: 16,
        flexWrap: 'wrap',
        fontFamily: 'Baloo-Medium',
        fontWeight: '600'
    },
    item_price: {
        color: 'gray',
        fontWeight: '500',
        marginLeft: 5,
        fontSize: 18,
        fontFamily: 'Baloo'
    },
    delete_container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    seller_icon: {
        height: 35,
        width: 35,
    },
    instruction: {
        color: new DynamicValue('#737373', '#a6a6a6'),
        fontSize: height / 42,
        marginBottom: height / 40,
        fontFamily: 'Baloo',
        alignSelf: 'center'
    },
})