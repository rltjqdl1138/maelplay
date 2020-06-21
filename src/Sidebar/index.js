import React, {Component} from 'react'
import {Text, View, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native'
//import { connect } from 'react-redux'
//import { SidebarActions } from '../store/actionCreator'
import {LogoutSidebar, LoginSidebar} from './SidebarComponent'
import {LogoutSetting, LoginSetting} from './SettingComponent'
//import LoginSidebar from '../containers/LoginSidebar'
//import LoginSetting from '../containers/LoginSetting'
//import LogoutSetting from '../containers/LogoutSetting'
//import deviceCheck from '../deviceCheck'

const screenHeight = Dimensions.get('window').height
const screenWidth = Dimensions.get('window').width

class MainComponent extends Component{
    handleWholePush=(page, config)=>{
        this.props.handleWholePush(page, config)
        this.props.handleClose()
    }
    handleMainPush=(page, config)=>{
        this.props.handleMainPush(page, config)
        this.props.handleClose()
    }
    getComponent=()=>{
        const {auth, settingHandler, handleClose} = this.props
        const type = (auth.isLogin ? 2:0) + (settingHandler.status ? 1:0)
        switch(type){
            // Login
            case 3:
                return (<LoginSetting auth={auth}
                        settingHandler={settingHandler}
                        handleWholePush={this.handleWholePush}
                        handleMainPush={this.handleMainPush}
                        handleClose={handleClose}
                    />)
            case 2:
                return (<LoginSidebar auth={auth}
                        settingHandler={settingHandler}
                        handleWholePush={this.handleWholePush}
                        handleMainPush={this.handleMainPush}
                    />)

            // Logout
            case 1:
                return (<LogoutSetting auth={auth}
                        settingHandler={settingHandler}
                        handleWholePush={this.handleWholePush}
                        handleMainPush={this.handleMainPush}
                    />)
            default:
                return (<LogoutSidebar auth={auth}
                        settingHandler={settingHandler}
                        handleWholePush={this.handleWholePush}
                        handleMainPush={this.handleMainPush}
                    />)
        }
    }
    render(){
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                {this.getComponent()}
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

    openSetting=()=>this.handleChange('isOpenSetting',true)
    closeSetting=()=>this.handleChange('isOpenSetting',false)

    render(){
        const {isOpenSetting, opa} = this.state
        const {handleMainPush, handleWholePush} = this.props
        return(
                <Animated.View style={this.getStyle()} >
                    <View style={{backgroundColor:'#000', width :opa, height:'100%', position:'absolute', opacity:0.7}} />
                    <View style={styles.main}>
                        <View style={{height:40}}/>
                        <MainComponent
                            settingHandler={{open:this.openSetting, close:this.closeSetting, status:isOpenSetting}}
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
