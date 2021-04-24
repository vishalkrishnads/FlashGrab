import { Dimensions } from 'react-native'
import { DynamicStyleSheet, DynamicValue } from 'react-native-dark-mode'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
export default new DynamicStyleSheet({
    root: {
        flex: 1,
        backgroundColor: new DynamicValue('white', 'black')
    },
    heading:{
        color: new DynamicValue('black', 'white'),
        fontWeight: 'bold',
        fontSize: width/18
    },
})