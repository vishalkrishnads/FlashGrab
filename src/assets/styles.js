//Styles file

import { Dimensions } from 'react-native';
import { DynamicValue } from 'react-native-dark-mode';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
export default {
    root: {
        backgroundColor: new DynamicValue('white', '#1a1a1a'),
        flex: 1
    },
    buttonStyle: {
        alignSelf: 'flex-end',
        height: 70,
        width: 70,
        marginBottom: 20,
        borderRadius: 100,
    },
    delete: {
        backgroundColor: 'transparent',
        marginTop: 25,
    },
    bottom: {
        alignItems: 'flex-end',
        height: 1,
        width: (width - 30),
        justifyContent: 'flex-end',
    },
    element: {
        flexDirection: 'row',
        height: 80,
        alignSelf: 'stretch',
    },
    elementroot: {
        height: 100,
        flexDirection: 'row',
        alignItems: 'stretch',
        alignItems: 'center',
    },
    elementimage: {
        borderRadius: 50,
        marginLeft: 10,
        height: 60,
        width: 60
    },
    elementext: {
        marginLeft: 10,
        flex: 5,
    },
    elementheading: {
        fontSize: 15,
        fontWeight: 'bold',
        color: new DynamicValue('black', 'white')
    },
    addmessage:{
        alignSelf: 'center',
        marginTop: height/2-100
    },
    username: {
        color: new DynamicValue('#737373', '#e6e6e6')
    },
    saleForm: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10
    },
    headings: {
        alignSelf: 'center',
        fontWeight: 'bold',
        marginTop: 20,
        color: new DynamicValue('black', 'white'),
    },
    datetimefield: {
        marginTop: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: new DynamicValue('#bfbfbf', '#cccccc'),
    },
    datetime: {
        backgroundColor: 'transparent',
        width: 600,
        height: 50,
        marginTop: 1
    },
    datetimetext: {
        fontSize: 18,
        color: new DynamicValue('black', 'white')
    },
    headercontainer: {
        alignItems: 'center',
        backgroundColor: new DynamicValue('#cccccc', '#404040')
    },
    seller: {
        width: 180,
        height: 180,
        marginTop: 20
    },
    product_name: {
        color: new DynamicValue('black', 'white'),
        fontWeight: 'bold',
        includeFontPadding: true,
        marginTop: 10,
        marginRight: 5,
        marginLeft: 15,
        marginBottom: 20
    },
    details: {
        flexDirection: 'row',
        height: 60,
        alignSelf: 'stretch',
        justifyContent: 'flex-start'
    },
    detailstext: {
        color: new DynamicValue('black', 'white'),
        marginTop: 20,
        fontSize: 15
    },
    detailsicon: {
        marginTop: 13
    },
    bottom: {
        alignItems: 'flex-end',
        height: 1,
        width: (width - 30),
        justifyContent: 'flex-end',
    },
    status: {
        fontWeight: '200',
        fontSize: 15,
        color: new DynamicValue('black', 'white')
    },
    applocktexts: {
        marginTop: 25,
        fontSize: 17,
        color: new DynamicValue('black', 'white')
    },
    icons: {
        marginTop: 17,
        marginLeft: 15,
        color: new DynamicValue('black', 'white')
    },
    modal: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        // backgroundColor: new DynamicValue('rgba(0,0,0,0.5)', 'rgba(192,192,192,0.3)'),
        flex: 1,
    },
    //pin lock modals
    pinseeker: {
        backgroundColor: new DynamicValue('white', 'black'),
        width: width - 80,
        height: 220,
        marginTop: height - (height * 0.65),
        marginLeft: width - (width * 0.9),
        marginRight: width - (width * 0.9),
    },
    heading:{
        marginTop: 20,
        marginBottom: 20,
        fontSize: 25,
        alignSelf: 'center',
        color: new DynamicValue('black', 'white'),
        fontWeight: 'bold',
    },
    button: {
        marginTop: 10,
        marginRight: 20,
        backgroundColor: new DynamicValue('white', 'black'),
    },
    settingselement: {
        flexDirection: 'row',
        height: 60,
        alignSelf: 'stretch',
    },
    settingstexts: {
        marginTop: 20,
        fontSize: 15,
        color: new DynamicValue('black', 'white')
    },
    settingsicons: {
        marginTop: 13,
        marginLeft: 15,
        color: new DynamicValue('black', 'white')
    },
    picker: {
        color: new DynamicValue('black', 'white'),
    },
    //splash screen
    container: {
        marginTop: height-(height/1.35),
        alignItems: 'center'
    },
    image: {
        borderRadius: 100,
        width: 250,
        height: 250
    },
    text: {
        color: new DynamicValue('black', 'white'),
        marginTop: 5
    },
    longbutton:{
        width: 180,
        borderRadius: 50
    },
    //terms of use
    paragraph:{
        marginTop: 15,
        marginBottom: 0,
        margin: 20
    },
    texts:{
        fontSize: 15,
        color: new DynamicValue('black', 'white'),
        marginBottom: 5
    }
};