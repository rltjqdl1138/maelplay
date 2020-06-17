import React, {Component} from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
//import * as SecureStore from 'expo-secure-store';
//import { connect } from 'react-redux'
//import { AuthenticationActions, AudioActions, MyPlaylistActions, ThemeActions  } from '../store/actionCreator'

/*
import HeaderContainer from '../containers/HeaderContainer'
import SearchContainer from '../containers/SearchContainer'
import MainContainer from '../containers/MainContainer'
import AlbumContainer from '../containers/AlbumContainer';
import deviceCheck from '../deviceCheck'
import PlayingPage from './PlayingPage'
import MyPlaylistPage from './MyPlaylistPage'
import SidebarPage from './SidebarPage'
import {Audio} from 'expo-av'

import networkHandler from '../networkHandler'
*/
import {Route, Navigator} from '../Navigator'

const SHUFFLE = 0
const REPEAT = 1
const SEQUENTE = 2


class MainPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoaded:false,
            //searchOpen:false,
            mainNavigator:{push:()=>{}, pop:()=>{}}
        }
    }
    componentDidMount(){
        //this.loadMyPlaylist()
        //this.loadAuthentication()
        //this.loadThemeList()
        //this.loadSoundObject()
        this.handleChange('isLoaded', true)
    }

    handleChange = (field, text) => this.setState({ [field]: text });
    
    /*
    loadSoundObject = async()=>{
        try{
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS:true,
                staysActiveInBackground:true,
                interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX
            })
            const soundObject = new Audio.Sound()
            await soundObject.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)
            await AudioActions.initialize({soundObject})
        }catch(e){
            console.warn(e)
        }
    }
    
    onPlaybackStatusUpdate = playbackStatus =>{
        if (!playbackStatus.isLoaded) {
            if (playbackStatus.error) {
                console.warn(`Encountered a fatal error during playback: ${playbackStatus.error}`);
            }
        } else if(playbackStatus.didJustFinish){
            switch(this.props.playOption.option){
                case SHUFFLE:
                    console.warn('shuffle')
                    AudioActions.next({})
                    break;
                case REPEAT:
                    console.warn('repeat')
                    AudioActions.jump({ms:0})
                    break
                case SEQUENTE:
                    console.warn('sequence')
                    AudioActions.next({})
            }
        }else if (playbackStatus.isPlaying){
            if(!this.props.isMusicLoaded) AudioActions.turnToPlay()
            AudioActions.timing({ms:playbackStatus.positionMillis, duration:playbackStatus.durationMillis})
        }
    }*/

    /*
    loadMyPlaylist = async() =>{
        const data = await networkHandler.music.getMusicList(1)
        if(!data || !data.musics || !data.album)
            console.warn(data)
        else
            MyPlaylistActions.load({list:data.musics})
    }*/

    /*
    loadAuthentication = async() =>{
        try{
            //const _result = await SecureStore.getItemAsync('token')
            //const result = JSON.parse(_result)
            //if(!result || !result.token) return;

            //const data = await networkHandler.account.checkToken(result.token)
            //return data && data.success ? AuthenticationActions.initialize(result) : null
        }catch(e){
            //console.warn(e)
            //return;
        }
    }*/

    /*
    loadThemeList = async() =>{
        const data = await networkHandler.music.getMainThemeList()
        if(data && data.success && data.result){
            const {result} = data
            ThemeActions.update(result)
        }
    }

    getMusicList = () =>{
        const {themeList} = this.props
        const themeTitle = themeList.map(dat=>({
            ID:dat.ID,
            title:dat.title
        }))
        const list = [...themeTitle]
        return list
    }
    */
    /*
    handleSearch = (setting) =>{
        this.setState((state)=>({
            ...state,
            searchOpen: setting
        }))
    }
    handleLogin = async (id, password)=>{
        try{
            const response = await networkHandler.account.Login(id, password)
            const {success, data} = response
            if(success && data)
                await AuthenticationActions.login({token:data.token, username:data.name, platform:data.platform})
            console.warn(response)
            return true
        }catch(e){
            console.warn(e)
            return false
        }
    }
    handleLogout = ()=>{
        AuthenticationActions.logout()
    }
*/
    handleWholePush = (name, config) => this.props.navigator.push(name,config)
    handleWholePop = (name) => this.props.navigator.pop(name)
    
    handleMainPush = (name, config) => this.state.mainNavigator.push(name, config)
    handleMainPop = (name) => this.state.mainNavigator.pop(name)
    
    registerNavigator = (navigator) =>
        navigator && typeof navigator === 'object' && typeof navigator.push === 'function' && typeof navigator.pop === 'function' ?
        this.handleChange('mainNavigator', {push:navigator.push, pop:navigator.pop})
            : console.warn('[Warning] Main Navigator handler is not registered')
    
    render(){
        //const {isLogin, token, username, showPlaybar} = this.props
        const {handleMainPush, handleMainPop, handleWholePush, handleWholePop} = this
        //const headerPos = 60+deviceCheck.getTopPadding()
        const headerPos = 100
        //const musicList = getMusicList()
        return(
            <View style={styles.container}>
                <View style={[styles.mainscreenContainer,{top:headerPos}]}>

                    <Navigator register={this.registerNavigator}>
                        <Route name="View1" component={View1}/>
                        <Route name="View2" component={View2}/>
                        <Route name="View3" component={View3}/>
                    </Navigator>

                    {/*
                        <Route name="MainContainer" component={MainContainer} />
                        <Route name="MyPlaylistPage" component={MyPlaylistPage} />
                        <Route name="AlbumContainer" component={AlbumContainer} />*/}
                    {/*<View style={showPlaybar? styles.bottomPadding:styles.hideBottomPadding} />*/}
                </View>
                <View style={[styles.header,{height:headerPos, flexDirection:'row'}]}>
                    <TouchableOpacity style={{flex:1, justifyContent:"center", backgroundColor:'gray'}}
                        onPress={()=>this.handleMainPop()}>
                        <Text>Main POP</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{flex:1, justifyContent:"center", backgroundColor:'gray'}}
                        onPress={()=>this.handleWholePop()}>
                        <Text>Whole POP</Text>
                    </TouchableOpacity>
                    {/*
                    <View style={{borderColor:'#fff',borderWidth:1,height:deviceCheck.getTopPadding()}} />
                    
                    <HeaderContainer
                        handleSidebar={this.props.handler.open}
                        handlePop={handleMainPop}
                        handleSearch={handleSearch}
                    />
                    */}
                </View>

                {/*
                
                <PlayingPage headerPos={headerPos} />
                <SearchContainer handler={handleSearch} searchOpen={this.state.searchOpen} headerPos={headerPos}/>
                
                <SidebarPage
                    isLogin={isLogin}
                    handleLogin ={this.handleLogin}
                    handleLogout={this.handleLogout}
                    username={username}
                    token={token}
                    handleMainPush={handleMainPush}
                    handleWholePush={handleWholePush}
                    musicList={musicList} />
                */}

            </View>
        )
    }
}

class View1 extends Component{
    render(){
        return (
            <View style={styles.container}>
                <Text>View1</Text>
                <TouchableOpacity onPress={()=>this.props.navigator.push('View2')}>
                    <Text>Push</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.props.navigator.pop('View1')}>
                    <Text>Pop</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

class View2 extends Component{
    render(){
        return (
            <View style={styles.container}>
                <Text>View2</Text>
                <TouchableOpacity onPress={()=>this.props.navigator.push('View3')}>
                    <Text>Push</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.props.navigator.pop('View2')}>
                    <Text>Pop</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

class View3 extends Component{
    render(){
        return (
            <View style={styles.container}>
                <Text>View3</Text>
                <TouchableOpacity onPress={()=>this.props.navigator.push('View4')}>
                    <Text>Push</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.props.navigator.pop('View3')}>
                    <Text>Pop</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width:'100%',
        height:'100%',
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    
    // HEADER
    header:{
        position:'absolute',
        top:0,
        width:'100%',
        backgroundColor:'#fff'
    },

    // MAIN SCREEN
    mainscreenContainer:{
        flex:1,
        width:'100%',
    },
    /*
    bottomPadding:{
        height:deviceCheck.ifTopbarless?215:180,
        width:'100%',
    },
    hideBottomPadding:{
        height:deviceCheck.ifTopbarless?100:20,
        width:'100%',
    },*/

});
/*

export default connect(
    (state)  =>({
        themeList: state.theme.list,
        isLogin: state.authentication.isLogin,
        token: state.authentication.token,
        username: state.authentication.username,
        handler: state.sidebar.handler,
        navList: state.navigator.navList,
        showPlaybar: state.audio.showPlaybar,
        playOption: state.audio.playOption,
        isMusicLoaded: state.audio.isLoaded
    })
)(MainPage)*/
export default MainPage
