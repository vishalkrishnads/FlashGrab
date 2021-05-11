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
        flex: 4,
        backgroundColor: new DynamicValue('#f2f2f2', '#333333'),
        borderRadius: 50,
        marginLeft: 10,
        marginRight: 10
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
    instruction:{
        color: new DynamicValue('#737373', '#a6a6a6' ),
        fontSize: height/45,
        marginBottom: height/40
    },
    segmented_control:{
        flex: 1,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
        borderRadius: 50,
        borderColor: global.accent,
        borderWidth: 2,
    },
    segmented_control_text:{
        fontSize: height/38, 
        margin: 10,
        fontWeight: '600'
    },
    date_container:{
        flex: 7,
        borderColor: new DynamicValue("black", "#f2f2f2"),
        borderWidth: 2,
        borderRadius: 25,
        flexDirection: 'row'
    },
    icon:{
        color: new DynamicValue("black", "#f2f2f2"),
        fontSize: height/15
    },
    icon_caption:{
        color: new DynamicValue("black", "#f2f2f2"),
        fontSize: height/45
    },
    error:{
        color: 'rgb(213, 0, 0)',
        fontSize: height/55
    }
})