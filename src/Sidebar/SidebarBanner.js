import React, {Component} from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
const {width} = Dimensions.get('window')

export default class SidebarBanner extends Component{
    render(){
        return(
            <View style={styles.container} />
        )
    }
}

//배너의 비율은 가로:세로 100:35를 기준으로 잡음
const styles = StyleSheet.create({
    container:{
        width: width*0.75,
        height: width*0.75*0.3,
        backgroundColor:'green'
    }
})
