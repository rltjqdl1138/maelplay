import React, {Component} from 'react'
import {View, TouchableOpacity, Modal, Dimensions, Text, StyleSheet } from 'react-native'

export default class LogoutModal extends Component {
    render(){
        const {closeModal, isModalVisible, logout} = this.props
        return(
            <Modal animationType='fade' 
                visible={isModalVisible}
                transparent={true}
                onRequestClose={closeModal}>
                    <View style={styles.container} >
                        <View style={styles.backgroundMask}/>

                        <View style={styles.mainContainer}>
                            <View style={styles.noticeContainer}>
                                <Text style={styles.noticeID}>rltjqdl1138</Text>
                                <Text style={styles.noticeText}>계정에서 로그아웃 하시겠습니까? 하시겠습니까</Text>
                            </View>

                            <View style={styles.buttonConatiner}>
                                <View style={{flexDirection:'row',}}>
                                    <TouchableOpacity style={styles.leftButton}
                                        onPress={()=>closeModal()}>
                                        <Text style={styles.buttonText}>취소</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.rightButton}
                                        onPress={()=>logout()}>
                                        <Text style={styles.buttonText}>로그아웃</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                    </View>
                </View>
            </Modal>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center'
    },
    backgroundMask:{
        width:'100%',
        height:'100%',
        position:'absolute',
        opacity:0.6,
        backgroundColor:'#000'
    },
    mainContainer:{
        backgroundColor:'#fff',
        width:250,
        height:200,
        borderRadius:20
    },
    noticeContainer:{
        flex: 1,
        width:'100%',
        height:'100%',
        justifyContent:'center',
        paddingBottom:20,
        paddingLeft:20,
        paddingRight:20
    },
    noticeID:{
        width:'100%',
        textAlign:'center',
        fontSize:15,
        padding:10,
        fontWeight:'bold'
    },
    noticeText:{
        width:'100%',
        textAlign:'center',
        fontSize:15,
    },
    buttonConatiner:{
        flex: 1,
        justifyContent:'center',
        position:'absolute',
        bottom:0,
        paddingTop:20,
    },
    leftButton:{
        backgroundColor:'#fff',
        width:'50%',
        borderBottomLeftRadius:20,
        borderColor:'#EAE8E8',
        borderWidth:0.5
    },
    rightButton:{
        backgroundColor:'#fff',
        width:'50%',
        borderBottomRightRadius:20,
        borderColor:'#EAE8E8',
        borderWidth:0.5
    },
    buttonText:{
        color:'blue',
        textAlign:'center',
        fontSize:17,
        margin:10
    }
})