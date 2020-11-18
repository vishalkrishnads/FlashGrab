import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Proptypes from 'prop-types';

const styles = StyleSheet.create({
    container:{
         alignItems: 'stretch',
         justifyContent: 'flex-start',
    },
    text:{
        color: 'gray',
        marginLeft: 15,
        marginTop: 10,
        fontSize: 15
    },
})

export default class Subheader extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
            return(
                <View style={styles.container}>
                    <Text style={styles.text}>{this.props.text}</Text>
                </View>
            );
    }
}

Subheader.proptypes = {text:Proptypes.string.isRequired};