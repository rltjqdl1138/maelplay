import React, {Component} from 'react'
import {View, StyleSheet, Text, ScrollView, Image, TouchableOpacity} from 'react-native'
import SidebarBanner from './SidebarBanner'

exports.LoginSidebar = class LoginSidebar extends Component{
    render(){
        const { auth, settingHandler, handleMainPush, handleWholePush } = this.props
        return(
            <View style={styles.container}> 
                <TouchableOpacity style={styles.settingContainer}
                    onPress={settingHandler.open}>
                    <Image style={styles.settingImage}
                        source={require('../../assets/icons/setting2.png')} />
                </TouchableOpacity>

                <View style={styles.signContainer}>
                    <TouchableOpacity onPress={()=>{handleWholePush('AccountInfoPage')}}>
                        <Text style = {styles.usernameText}>
                            {auth.name ? auth.name + " 님," : "blank"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.gotoPlaylistContainer}
                        onPress={()=>handleMainPush('MyPlaylistPage')} >
                        <Text style={styles.gotoPlaylistText}>내 플레이리스트 {">"} </Text>
                    </TouchableOpacity>
                </View>

                <SidebarBanner />
                
                <View style={styles.otherContainer}>
                    <ScrollView>

                    </ScrollView>
                </View>
                <View style={styles.bottomPadding}/>
            </View>
        )
    }
}

exports.LogoutSidebar = class LogoutSidebar extends Component{
    render(){
        const { settingHandler, handleMainPush, handleWholePush } = this.props
        return(
            <View style={styles.container}>
                <TouchableOpacity style={styles.settingContainer}
                    onPress={settingHandler.open}>
                    <Image style={styles.settingImage}
                        source={require('../../assets/icons/setting2.png')}
                    />
                </TouchableOpacity>

                <View style={styles.signContainer}>
                    <TouchableOpacity
                        style={styles.loginContainer}
                        onPress={()=>handleWholePush('Loginpage')}>
                        <Image style={styles.loginImage}
                            source={require('../../assets/icons/login_sidebar.png')} />
                    </TouchableOpacity>
                </View>

                <SidebarBanner />

                <View style={styles.otherContainer}>
                    <ScrollView>

                    </ScrollView>
                </View>
                <View style={styles.bottomPadding}/>
            </View>
        )
    }
}

const styles= StyleSheet.create({
    container:{
        width:'100%',
        height:'100%',
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

    signContainer:{
        height: 50,
        paddingTop:10,
        paddingLeft:20,
    },

    loginContainer:{
        height:'100%',
        width:'30%',
    },
    loginImage:{
        resizeMode:'contain',
        width:'100%',
        height:'100%'
    },

    usernameText:{
        fontSize:17,
        fontWeight:'bold',
        color:'#121111'
    },
    gotoPlaylistContainer:{
        height: 35,
        width:'100%',
        paddingLeft:20,
    },
    gotoPlaylistText:{
        width:'100%',
        fontSize:15,
        textAlign:'left',
        color:'#646363'
    },


    otherContainer:{
        flex:1,
        width:'100%'
    },

    bottomPadding:{
        height:30,
        width:'100%',
        backgroundColor:'#000'
    }
})