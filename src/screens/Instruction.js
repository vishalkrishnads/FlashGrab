import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDynamicStyleSheet } from 'react-native-dark-mode'
import NetInfo from "@react-native-community/netinfo"
import ProgressCircleSnail from 'react-native-progress/CircleSnail'
import dynamicStyles from '../assets/styles/Instructions'
import AdView from '../assets/misc/AdView'

const Instructions = ({ navigation }) => {
    const styles = useDynamicStyleSheet(dynamicStyles)
    let [intro, set_intro] = React.useState(true);
    let [index, set_index] = React.useState([])
    let [data, set_data] = React.useState([])
    let [error, set_error] = React.useState(`Loading`)
    const switch_to = (direction) => {
        var temp = []
        data.forEach(() => temp.push(false))
        if (direction === "next") {
            if (intro) { set_intro(false); temp[0] = true }
            else if (data.length === index.indexOf(true) + 1) { navigation.pop() }
            else { temp[index.indexOf(true) + 1] = true }
        } else if (direction === "back") {
            if (index.indexOf(true) == 0) { set_intro(true) }
            else { temp[index.indexOf(true) - 1] = true }
        }
        set_index(temp)
    }
    React.useEffect(() => {
        fetch('https://flashgrab.firebaseapp.com/cdn/data/instructions.json')
            .then((response) => response.json())
            .then((json) => { set_error(``); set_data(json.data) })
            .catch(() => {
                set_error(`Can't connect`)
                NetInfo.fetch().then(state => !state.isConnected ? set_error(`No Internet`) : null);
            })
    }, [])
    const Instruction = ({ key, image, text }) => {
        return (
            <View style={{ flex: 5, flexDirection: 'row' }}>
                <View style={{ flex: 0.2 }}></View>
                <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        source={{ uri: image }}
                        style={styles.image}
                    />
                </View>
                <View style={{ flex: 0.5 }}></View>
                <View style={{ flex: 2, alignItems: 'flex-end', justifyContent: 'center' }}>
                    <Text style={styles.text}>{text}</Text>
                </View>
            </View>
        );
    }
    return (
        <SafeAreaView style={styles.root}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.heading}>Instructions</Text>
            </View>
            {!intro ? <View style={styles.gallery}>
                <AdView media={false}/>
            </View> : null}
            <View style={{ flex: 8 }}>
                <View style={{ flex: 8 }}>
                    <View style={{ flex: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ flex: 0.5 }}></View>
                        {intro ? <View style={{ flex: 5 }}>
                            <Text style={styles.text}>
                                Today, the most prominent online seller websites hold flash sales to help brands manage their stocks effectively. Most of the good stuff goes on sale via flash sales and in the process, consumers won't be able to get their hands on them. Thereafter, in many cases, consumers are forced to pay high prices to third party dealers to get the product. These days, there are people who even make money by using automated scripts to buy the products in bulk and then sell them at high prices. Although Amazon & Flipkart have both taken measures to prevent these frauds, they find workarounds to come over it.
                            </Text>
                            <Text style={[styles.text, { marginTop: 20 }]}>
                                Enter FlashGrab, a one stop solution to the problem. We aim to empower the common consumer to buy their product of choice without paying insanely high prices to any third party. This app itself is an automated script at the core to automate the buying process. You have almost 80% more chances of getting a product in flash sales at that reduced price itself if you use FlashGrab.
                            </Text>
                        </View> : data.map((instruction, instruction_index) => index[instruction_index] ? <Instruction key={instruction_index.toString()} text={instruction.text} image={instruction.video} /> : null)}
                        <View style={{ flex: 0.2 }}></View>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <View style={{ flex: 8 }}></View>
                    {intro ? null : <TouchableOpacity onPress={() => switch_to("back")} style={[styles.button, { backgroundColor: global.accent }]}><Text style={styles.button_text}>Back</Text></TouchableOpacity>}
                    {error === `Loading` ? <View style={{ flex: 4, alignItems: 'center', justifyContent: 'center' }}>
                        <ProgressCircleSnail color={global.accent} />
                    </View> : <TouchableOpacity onPress={() => error ? null : switch_to("next")} style={[styles.button, { backgroundColor: error ? 'red' : global.accent }]}><Text style={styles.button_text}>{data.length === index.indexOf(true) + 1 ? `Got it` : intro ? error ? error : `Let's go` : `Next`}</Text></TouchableOpacity>}
                </View>
                <View style={{ flex: 0.5, alignItems: 'center' }}>
                    <Text style={styles.copyright}>&copy; 2021 FlashGrab. All rights reserved.</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Instructions;