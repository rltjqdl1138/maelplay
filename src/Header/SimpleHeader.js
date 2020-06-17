import React, {Component} from 'react'
import {View, StyleSheet, TouchableOpacity, Image, Text, Animated} from 'react-native'
//import deviceCheck from '../deviceCheck'

export default class SimpleHeader extends Component {
    componentDidUpdate(){
        Animated.timing(this.noticeY, {
            toValue: this.props.notice==='' ? -43 : 0,
            duration: 200
        }).start()
    }
    
    noticeY = new Animated.Value(-43);
    getNoticeStyle=()=>{ return [styles.noticeStyle, {transform:[{translateY:this.noticeY}] }]}
    
    render(){
        const {title, handler, notice, handleComplete, disableNotice} = this.props
        //const WholeSize = deviceCheck.getTopPadding() + (disableNotice?60:103)
        const padding = 40
        const WholeSize = padding + (disableNotice?60:103)
        return (
            <View style={[styles.container,{height:WholeSize}]}>
                    
                <View style={{height:padding}}/>
                <View style={[styles.headerContainer,{height:disableNotice?60:103}]}>
                    <Animated.View style={[this.getNoticeStyle(),{display: disableNotice?'none':'flex'}]}>
                        <Text style={styles.noticeText}> {notice} </Text>
                    </Animated.View>

                    <View style={[styles.blank,{height:disableNotice?0:43}]} />
                    <View style={styles.mainContainer} >
                        <TouchableOpacity style={styles.backButtonContainer}
                            onPress={handler}  >
                            <Image style={styles.backButtonImage}
                                source={require('../../assets/icons/back.png')}  />
                        </TouchableOpacity>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>
                                {title}
                            </Text>
                        </View>
                        <TouchableOpacity style={[styles.completeButton, {display:handleComplete?'flex':'none'}]}
                            disabled={!handleComplete}
                            onPress={()=>{
                                    switch( typeof handleComplete ){
                                        case 'function':
                                            return handleComplete()
                                        case 'object':
                                            return handleComplete.handler? handleComplete.handler():null
                                        default:
                                            return null
                                    }
                                }}>
                            <Text style={{fontSize:18, color:'#0562bf'}}>
                                { handleComplete && handleComplete.title ? handleComplete.title : '완료' }
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>

            </View>
        )
    }   
}

const styles=StyleSheet.create({
    container:{
        width:'100%',
    },
    headerContainer:{
        width:'100%',
        flexDirection:'column-reverse',
    },
    mainContainer:{
        height:60,
        width:'100%',
        flexDirection:'row',
        justifyContent:'center',
        backgroundColor:'#fff',
        flexDirection:'row',
        borderBottomColor:'#767171',
        borderBottomWidth:0.3,
    },
    noticeStyle:{
        position:'absolute',
        height:43,
        width:'100%',
        backgroundColor:'#2f2d2d',
        justifyContent:'center',
    },
    noticeText:{
        fontSize:14,
        textAlign:'center',
        color:'#70e255'
    },

    backButtonContainer:{
        height:'100%',
        width:80,
        justifyContent:'center'
    },
    backButtonImage:{
        width:'80%',
        height:'80%',
        resizeMode:'contain'
    },

    titleContainer:{
        height: '100%',
        flex:1,
        paddingRight:80,
        justifyContent:'center',
    },
    title:{
        fontSize: 19,
        textAlign:'center',
        color:'#121111',
        fontWeight:'300'
    },
    completeButton:{
        position:'absolute',
        width:60,
        height:'100%',
        justifyContent:'center',
        right:0,
    },
    blank:{
        height:43,
        width:'100%'
    }
})