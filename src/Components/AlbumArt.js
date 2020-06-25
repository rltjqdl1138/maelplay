import React, {Component} from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Image, Dimensions } from 'react-native'
import Network from '../NetworkHandler'

const frames = [
    require('../../assets/frames/0.png'),
    require('../../assets/frames/1.png'),
    require('../../assets/frames/2.png'),
    require('../../assets/frames/3.png')
]

export default class AlbumArt extends Component{
    render(){
        const ImgURL = this.props.url ? Network.url +'/image/'+this.props.url+'.jpeg' :Network.url +'/image/class.jpeg'
        //const ImgURL = Network.url +'/image/class.jpeg'
        const designType = typeof this.props.designType === 'number' && this.props.designType < 4 ? this.props.designType : 0
        return (
            <View style={styles.container}>
                <Image style={styles.image}
                    source={{uri:ImgURL}} />
                
                <Image style={styles.image}
                    source={frames[designType]} />
            </View>
        )

    }
}

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        width:'100%',
        height:'100%',
        resizeMode:'contain',
    },
    image:{
        position:'absolute',
        width:'100%',
        height:'100%',
        resizeMode:'contain'
    }

})