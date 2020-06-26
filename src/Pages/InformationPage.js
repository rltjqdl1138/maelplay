import React, {Component} from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity }from 'react-native'
import SimpleHeader from '../Header/SimpleHeader'
import {Inform} from '../NetworkHandler'

export default class InformationPage extends Component{
    constructor(props){
        super(props)
        this.state = {
            key: this.props.config.key,
            title:'',
            data:[],
            isLoaded:false
        }
    }
    componentDidMount(){
       this.getAccountInfo()
    }
    getAccountInfo = async()=>{
        const response = await Inform.getInfo(this.state.key)
        return !response.success || !response.data ? this.props.navigator.pop('Informationpage') :
            this.setState({
                title:response.title,
                data:response.data,
                isLoaded:true
            })
    }
    
    render(){
        const {navigator} = this.props
        const { data, title, isLoaded} = this.state
        const list = data.map((item, index)=>(
            <TextComponent 
                key={index}
                text={item.text}
                color={item.color}
                fontWeight={item.fontWeight}
                fontSize={item.fontSize}
            />
        ))
        return(   
            <View style={styles.container}>
                <SimpleHeader 
                    title={title ? title : '안내'}
                    disableNotice={true}
                    handler={()=>{navigator.pop('Informationpage')}}
                    notice='' />

                <ScrollView style={styles.mainContainer}>
                    <View style={styles.simplePadding} />
                    { list }

                    <View style={styles.simplePadding} />
                </ScrollView>
            </View>
        )
    }
}

class TextComponent extends Component{
    render(){
        const text = this.props.text ? this.props.text : ''
        const color = this.props.color ? this.props.color : '#121111'
        const fontWeight = this.props.fontWeight ? this.props.fontWeight : 'normal'
        const fontSize = this.props.fontSize ? parseInt(this.props.fontSize) : 15
        return (
            <Text style={[styles.textComponent, {color, fontSize, fontWeight}]}>
                {text}
            </Text>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    },
    mainContainer:{
        paddingLeft:40,
        paddingRight:40
    },
    textComponent:{
        paddingBottom:20
    },
    simplePadding:{
       height:20 
    }
})