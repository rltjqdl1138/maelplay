import React, {Component} from 'react'
import { View, StyleSheet, Text, Button, ScrollView, Image, TouchableOpacity } from 'react-native'
//import deviceCheck from '../deviceCheck'
import LogoutModal from './logoutModal'

exports.LoginSetting = class LoginSetting extends Component{
    constructor(props){
        super(props)
        this.state = {isModalVisible: false}
    }
    handleLogout=()=>{
        this.props.auth.handleLogout()
        this.props.handleClose()
    }
    list = [
        {title:'플랜선택', handler:()=>this.props.handleWholePush('Planpage'), textStyle:{color:'#121111'}},
        {title:'개인정보', handler:()=>this.props.handleWholePush('Userinfopage')},
        {title:'계정정보', handler:()=>this.props.handleWholePush('Accountinfopage')},
        {title:'공지사항', handler:()=>this.props.handleWholePush('Informationpage')},
        {title: this.props.auth.platform==='original'?'비밀번호 변경':null, handler:()=>this.props.handleWholePush('Changeinfopage',{key:'password',name:'비밀번호',value:''})},
        {title:'이용안내 및 약관', handler:()=>this.props.handleWholePush('Informationpage', {key:'usage'})},
        {title:'로그아웃', handler:()=>this.setState(({isModalVisible:true}))}
    ]
    render(){
        const { settingHandler, auth } = this.props
        return(
            <View style={styles.container}>
                <TouchableOpacity style={styles.settingContainer}
                    onPress={settingHandler.close}>
                    <Image style={styles.settingImage}
                        source={require('../../assets/icons/setting.png')} />
                </TouchableOpacity>
                <View style={styles.mainContainer}>
                    {this.list.map((item,index)=>item.title ?
                    ( <SettingItem key={index}
                        style={item.style}
                        textStyle={item.textStyle}
                        handler={item.handler}
                        title={item.title} />) : null
                    )}
                </View>
                <LogoutModal
                    isModalVisible={this.state.isModalVisible}
                    closeModal={()=>this.setState(({isModalVisible:false}))}
                    logout={this.handleLogout}
                />
            </View>
        )
    }
}


exports.LogoutSetting = class LoginSetting extends Component{
    
    list = [
        {title:'플랜 안내', handler:()=>this.props.handleWholePush('Informationpage',{key:'plan'})},
        {title:'이용안내 및 약관', handler:()=>this.props.handleWholePush('Informationpage',{key:'usage'})}
    ]
    render(){
        const { handleMainPush, handleWholePush, settingHandler } = this.props
        return(
            <View style={styles.container}>
                <TouchableOpacity style={styles.settingContainer}
                    onPress={settingHandler.close} >
                    <Image style={styles.settingImage}
                        source={require('../../assets/icons/setting.png')} />
                </TouchableOpacity>
                <View style={styles.mainContainer}>
                    {this.list.map((item,index)=>(
                        <SettingItem key={index}
                            style={item.style}
                            textStyle={item.textStyle}
                            handler={item.handler}
                            title={item.title} />
                    ))}
                </View>
            </View>
        )
    }
}

class SettingItem extends Component{
    render(){
        const {style, textStyle, handler, title} = this.props
        return (
            <TouchableOpacity style={[styles.mainItem, style]} onPress={handler} >
                <Text style={[styles.mainItemText, textStyle]}>
                    {title}
                </Text>
            </TouchableOpacity>
        )
    }
}



const styles= StyleSheet.create({
    container:{
        width:'100%',
        height:'100%',
        justifyContent:'center'
    },
    settingContainer:{
        height:40,
        margin:0,
        padding:0,
        marginTop:4,
        justifyContent:'flex-end',
        alignItems:'flex-end'
    },
    settingImage:{
        position:'absolute',
        right:-5,
        bottom:0,
        height:'100%',
        width:'18%',
        resizeMode:'contain',
    },

    mainContainer:{
        flex:1,
        backgroundColor:'#fff',
        paddingTop:100
    },
    mainItem:{
        height:50,
        paddingLeft: 30
    },
    mainItemText:{
        fontSize:16,
        color:'gray'
    }


})
