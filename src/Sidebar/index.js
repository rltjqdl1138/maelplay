import React, {Component} from 'react'
import {Text, View, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native'
//import { connect } from 'react-redux'
//import { SidebarActions } from '../store/actionCreator'
//import LogoutSidebar from '../containers/LogoutSidebar'
//import LoginSidebar from '../containers/LoginSidebar'
//import LoginSetting from '../containers/LoginSetting'
//import LogoutSetting from '../containers/LogoutSetting'
//import deviceCheck from '../deviceCheck'

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

class MainComponent extends Component{
    handleClick=()=>{
        this.props.handleWholePush('Loginpage')
        this.props.handleClose()
    }
    handleClick2=()=>{
        this.props.auth.handleLogout()
        this.props.handleClose()
    }
    render(){
        const { handleMainPush, handleWholePush, handleClose } = this.props
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <TouchableOpacity onPress={this.handleClick}>
                    <Text>PUSH</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleClick2}>
                    <Text>{this.props.auth.name+' 로그아웃'}</Text>
                </TouchableOpacity>
            </View>
        )
        
    }
}

export default class SidebarPage extends Component{
    constructor(props){
        super(props)
        this.state = { isOpenSetting:false, opa:'0%'}
    }
    componentDidMount(){
        this.props.register ? this.props.register({
            open: this.handleOpen,
            close: this.handleClose
        }) : null
    }
    handleChange = (field, text) => this.setState({ [field]: text });

    translatedX = new Animated.Value(-screenWidth)
    getStyle = () => [ styles.container, {transform: [{translateX: this.translatedX}]} ]
    
    handleOpen = () =>{
        this.handleChange('opa','200%')
        Animated.timing(this.translatedX,{
            toValue:0,
            duration:200,
            useNativeDriver:true
        }).start()
    }
    handleClose=()=>
        Animated.timing(this.translatedX,{
            toValue:-screenWidth,
            duration:200,
            useNativeDriver:true
        }).start(()=> this.setState({ isOpenSetting:false, opa:'0%' }))
    

    render(){
        const {isOpenSetting, opa} = this.state
        const {handleMainPush, handleWholePush} = this.props
        return(
                <Animated.View style={this.getStyle()} >
                    <View style={{backgroundColor:'#000', width :opa, height:'100%', position:'absolute', opacity:0.7}} />
                    <View style={styles.main}>
                        <MainComponent
                            handleMainPush={handleMainPush}
                            handleWholePush={handleWholePush}
                            handleClose={this.handleClose}
                            auth={this.props.auth}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.blank}
                        onPress={this.handleClose}
                    />
                </Animated.View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        width:'100%',
        height:'100%',
        flexDirection:'row',
        position:'absolute',
    },
    main:{
        borderWidth: 1,
        borderTopRightRadius:10,
        borderBottomRightRadius:10,
        borderColor:'#aaa',
        flex: 3,
        backgroundColor: '#fff',
        opacity:1
    },
    blank:{
        flex: 1
    }
    
})
