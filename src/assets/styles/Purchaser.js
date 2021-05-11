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
        justifyContent: 'flex-end',
        marginBottom: height/25,
        marginTop: height/25,
        marginRight: width/35,
        alignItems: 'flex-start'
    },
    text:{
        color: new DynamicValue('black', 'white'),
        fontSize: width/24,
        marginBottom: height/40
    }
})