import React, {Component} from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image }from 'react-native'

export default class GreetingPage extends Component{
    componentDidMount(){
        setTimeout(()=>{
            this.props.navigator.pop()
        },1500)
        
    }
    render(){
        return(
            <View style={{flex:1, backgroundColor:'#fff', alignItems:'center', justifyContent:'center'}}>
                <View style={{width:80, height:100, alignItems:'center', justifyContent:'center'}}>
                    
                </View>
                <View style={{height:150, width:'100%'}}>
                    <Text style={{fontSize:18, color:'black', textAlign:'center', fontWeight:'bold'}}>Welcome to Mael!</Text>

                </View>
            </View>
    )}
}

/*

                    <Text style={{fontSize:17, color:'black', textAlign:'center'}}>가입완료</Text>
                    <View style={{height:5}} />
*/