import { Dimensions } from 'react-native'
import { DynamicStyleSheet, DynamicValue } from 'react-native-dark-mode'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
export default new DynamicStyleSheet({
    loading_animation: {
        width: '100%',
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center',
    },
    ad_badge:{
        width: height/40,
        height: height/40,
        borderWidth: 2,
        borderRadius: 50,
        borderColor: "gray",
        justifyContent: 'center',
        margin: width/25
    },
    ad_badge_text:{
        fontSize: height/90,
        color: 'gray',
        alignSelf: 'center',
        fontFamily: 'Baloo-Bold'
    },
    header: {
        width: '100%',
        justifyContent: 'center',
        // alignItems: 'center',
        flexDirection: 'row'
    },
    icon: {
        height: width / 8,
        width: width / 8,
        marginLeft: width/20,
        borderRadius: 50
    },
    headlineview: {
        fontFamily: 'Baloo-Bold',
        fontSize: width/28,
        width: '100%',
        alignSelf: 'center',
        color: new DynamicValue('black', 'white')
    },
    advertiserview: {
        fontSize: width/43,
        fontFamily: 'Baloo',
        color: 'gray'
    },
    body:{
        height: '5%',
        width: '100%'
    },
    mediaview:{
        width: '100%',
        height: height/4.5
    }
})