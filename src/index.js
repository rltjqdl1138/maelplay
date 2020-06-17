import React, {Component} from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'
import * as SecureStore from 'expo-secure-store';
import {Route, Navigator} from './Navigator'
import MainPage from './Pages/MainPage'
import LoginPage from './Pages/LoginPage'

export default class RootContainer extends Component{
    constructor(props){
        super(props)
        this.state={
            auth:{isLogin:false, name:'', token:'', platform:''}
        }
    }
    componentDidMount(){
        this.loadAuthentication()

    }
    loadAuthentication = async()=>{
        try{
            const _result = await SecureStore.getItemAsync('authentication')
            const result = JSON.parse(_result)
            this.handleChange('auth', {...result, isLogin:true})
        }catch(e){
            this.handleChange('auth', {isLogin:false, name:'', token:'', platform:''})
        }
    }
    saveAuthentication = async(token)=>{
        try{
            const data = String(JSON.stringify(token))
            await SecureStore.setItemAsync('authentication', data)
        }catch(e){
            console.warn(e)
        }
    }
    handleChange = (field, text) => this.setState({ [field]: text });
    handleLogin=({name, token, platform})=>{
        name && token && platform ? this.handleChange('auth', {isLogin:true, name, token, platform}) : null
        this.saveAuthentication({token, name, platform})
    }
    handleLogout=()=>
        this.handleChange('auth', {isLogin:false, name:'no', token:'', platform:''})
    render(){
        return(
            <Navigator auth={{...this.state.auth, handleLogin:this.handleLogin, handleLogout:this.handleLogout}}>
                <Route name="Mainpage" component={MainPage} />
                <Route name="Loginpage" component={LoginPage} />
                <Route name="null" component={View} />
            </Navigator>
        )
    }
}