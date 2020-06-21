// Expo modules
import React, {Component} from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Audio } from 'expo-av'

import Sidebar from '../Sidebar'
import MainHeader from '../Header/MainHeader'
import SearchComponent from '../Header/SearchComponent'
import ThemeContainer from '../Containers/ThemeContainer'
import AlbumContainer from '../Containers/AlbumContainer'
import PlayingPage from './PlayingPage'
import { Music } from '../NetworkHandler'
/*
import HeaderContainer from '../containers/HeaderContainer'
import SearchContainer from '../containers/SearchContainer'
import MainContainer from '../containers/MainContainer'
import AlbumContainer from '../containers/AlbumContainer';
import deviceCheck from '../deviceCheck'
import PlayingPage from './PlayingPage'
import MyPlaylistPage from './MyPlaylistPage'
import SidebarPage from './SidebarPage'

*/
import {Route, Navigator} from '../Navigator'

const SEQUENTE = 0
const SHUFFLE = 1
const REPEAT = 2


class MainPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoaded:false,
            myPlaylistInfo:[],
            musicInfo:{soundObject:null, isLoaded:false, isPlaying:false, playlist:[], playingAlbum:{}, playOption:SEQUENTE, playingIndex:-1, playingAlbumID:-1},
            searchNavigator:{open:()=>{this.handleOpenSearch()}, close:()=>{this.handleCloseSearch()}, status:false},
            sidebarNavigator:{open:()=>{}, close:()=>{}, status:''},
            mainNavigator:{push:()=>{}, pop:()=>{}}
        }
    }
    componentDidMount(){
        this.loadMyPlaylist()
        this.createSoundObject()
        this.handleChange('isLoaded', true)
    }
    componentWillUnmount(){
        const {isPlaying} = this.state.musicInfo
        isPlaying ? this.PauseSound() : null
    }

    handleChange = (field, text) => this.setState({ [field]: text });
    
    // *        *
    // * SOUNDS *
    // *        *
    createSoundObject = async()=>{
        try{
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS:true,
                staysActiveInBackground:true,
                interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX
            })
            const soundObject = new Audio.Sound()
            this.handleChange('musicInfo', {soundObject, isLoaded:true, isPlaying:false, playlist:[], playOption:0, playingIndex:-1, playingAlbumID:-1})
        }catch(e){
            console.warn(e)
            this.handleChange('musicInfo', {soundObject:null, isLoaded:false, isPlaying:false, playlist:[], playOption:0, playingIndex:-1, playingAlbumID:-1})
        }
    }

    LoadSound = async(_index)=>{
        const {soundObject, isPlaying, playlist} = this.state.musicInfo
        let index = _index < 0 ? playlist.length - 1 : _index
        index = index < playlist.length ? index : index - playlist.length
        try{
            isPlaying ? await soundObject.pauseAsync() : null
            await soundObject.unloadAsync()
            const result = await Music.getMusicFromCache(playlist[index].uri)
            result.status === 'fail' ? console.warn('Download Fail') : console.warn(result.status)
            await soundObject.loadAsync({uri:result.uri})
            await soundObject.playAsync()
            this.handleChange('musicInfo',{...this.state.musicInfo, isPlaying:true, playingIndex:index})
        }catch(e){
            console.warn(e)
            this.handleChange('musicInfo',{...this.state.musicInfo, isPlaying:false, playingIndex:index})
        }
    }
    changeOption = async(index)=>{
        index === 0 || index === 1 || index === 2 ?
            this.handleChange('musicInfo',{...this.state.musicInfo, playOption:index}) : null
    }
    SetHandler = async(statusFunction)=>{
        return await this.state.musicInfo.soundObject.setOnPlaybackStatusUpdate(statusFunction)
    }
    UpdateSoundList = async(list, album)=>{
        return this.handleChange('musicInfo',{...this.state.musicInfo, playingAlbumID:album.ID, playlist:list, playingAlbum:album})
    }
    PauseSound = async()=>{
        await this.state.musicInfo.soundObject.pauseAsync()
        this.handleChange('musicInfo',{...this.state.musicInfo, isPlaying:false})
    }
    ResumeSound = async()=>{
        await this.state.musicInfo.soundObject.playAsync()
        this.handleChange('musicInfo',{...this.state.musicInfo, isPlaying:true})
    }
    StopSound = async()=>{
        await this.state.musicInfo.soundObject.pauseAsync()
        await this.state.musicInfo.soundObject.unloadAsync()
        this.handleChange('musicInfo', {...this.state.musicInfo, isPlaying:false, playlist:[], playingIndex:-1, playingAlbumID:-1})
    }
    JumpSound = async(ms)=>{
        return await this.state.musicInfo.soundObject.setPositionAsync(ms)
    }
    NextSound = async(_index, isClick)=>{
        const {playingIndex, playOption} = this.state.musicInfo
        let nextIndex;
        switch(playOption){
            case SEQUENTE:
                nextIndex = playingIndex + 1; break
            case SHUFFLE:
                //TODO: random
                nextIndex = playingIndex + 1; break;
            case REPEAT:
                nextIndex = nextIndex = isClick ? playingIndex+1 :playingIndex; break;
        }
        const index = _index === undefined ? nextIndex : _index
        await this.LoadSound(index)
    }

    //
    // * MY PLAYLIST *
    //
    
    loadMyPlaylist = async()=>{
        const result = await Music.getMyPlaylist()
        this.handleChange('myPlaylistInfo', result)
    }
    AppendMyPlaylist = async(data)=>{
        const {myPlaylistInfo} = this.state
        let newList = []
        // Append list
        if(data.length && data.length > 0)
            newList = [...myPlaylistInfo, ...data]
        // Append a Item
        else if(data.MID && data.title)
            newList = [...myPlaylistInfo, data]
        
        // Set List
        await this.handleChange('myPlaylistInfo', newList)
        Music.setMyPlaylist(newList)
        this.MyPlaylistHandler()
        return {success:true, data: data.length?data.length : 1}
    }
    DeleteMyPlaylist = async (index)=>{
        const {myPlaylistInfo, musicInfo} = this.state
        let newList = []

        // Unexcepted case
        if(index=== undefined || typeof index !== 'number' || index < 0 || index >= myPlaylistInfo.length)
            return;
        if(musicInfo.playingAlbumID === 0 && musicInfo.playingIndex === index)
            await this.StopSound()

        if(index === 0)
            newList = [...myPlaylistInfo.slice(1,myPlaylistInfo.length)]
        else if(index === myPlaylistInfo.length - 1)
            newList = [...myPlaylistInfo.slice(0, myPlaylistInfo.length-1)]
        else
            newList = [...myPlaylistInfo.slice(0, index), ...myPlaylistInfo.slice(index+1, myPlaylistInfo.length)]
        
        // Set List
        await this.handleChange('myPlaylistInfo', newList)
        Music.setMyPlaylist(newList)
        this.MyPlaylistHandler()
        return {success:true}
    }
    MyPlaylistHandler = ()=>{}
    setMyPlaylistHandler = (handler)=>{
        console.warn(handler)
        if(typeof handler === 'function')
            this.MyPlaylistHandler = handler
    }

    handleWholePush = (name, config) => this.props.navigator.push(name,config)
    handleWholePop = (name) => this.props.navigator.pop(name)
    
    handleMainPush = (name, config) => this.state.mainNavigator.push(name, config)
    handleMainPop = (name) => this.state.mainNavigator.pop(name)
    registerNavigator = (navigator) =>
        navigator && typeof navigator === 'object' && typeof navigator.push === 'function' && typeof navigator.pop === 'function' ?
        this.handleChange('mainNavigator', {push:navigator.push, pop:navigator.pop})
            : console.warn('[Warning] Main Navigator handler is not registered')
    
    handleOpenSidebar = () => this.state.sidebarNavigator.open()
    handleCloseSidebar = () => this.state.sidebarNavigator.close()
    registerSidebarNavigator = (navigator) =>
        navigator && typeof navigator === 'object' && typeof navigator.open === 'function' && typeof navigator.close === 'function' ?
        this.handleChange('sidebarNavigator', {open:navigator.open, close:navigator.close, status:'close'})
            : console.warn('[Warning] Sidebar Navigator handler is not registered')

    handleOpenSearch = () => this.handleChange('searchNavigator', {...this.state.searchNavigator, status:true})
    handleCloseSearch = () => this.handleChange('searchNavigator', {...this.state.searchNavigator, status:false})
    
    render(){
        //const {isLogin, token, username, showPlaybar} = this.props
        const {LoadSound, NextSound, ResumeSound, PauseSound, UpdateSoundList, JumpSound, changeOption, SetHandler} = this
        const {AppendMyPlaylist, DeleteMyPlaylist, setMyPlaylistHandler} = this
        const {handleMainPush, handleMainPop, handleWholePush, handleWholePop} = this
        //const headerPos = 60+deviceCheck.getTopPadding()
        const padding = 40
        const headerPos = 60 + padding
        //const musicList = getMusicList()
        const musicHandler = { info:this.state.musicInfo, load:LoadSound, next:NextSound, resume:ResumeSound, pause:PauseSound, update:UpdateSoundList, jump:JumpSound, setOption:changeOption, setHandler:SetHandler }
        const myplaylistHandler = {info:this.state.myPlaylistInfo, append:AppendMyPlaylist, remove:DeleteMyPlaylist, setHandler:setMyPlaylistHandler}
        return(
            <View style={styles.container}>
                <View style={[styles.mainscreenContainer,{top:headerPos}]}>

                    <Navigator register={this.registerNavigator} handler={{Music:musicHandler, Myplaylist:myplaylistHandler}}>
                        <Route name="Themecontainer" component={ThemeContainer} />
                        <Route name="Albumcontainer" component={AlbumContainer} />
                    </Navigator>
                    <View style={styles.hideBottomPadding} />
                </View>
                <View style={[styles.header,{height:headerPos}]}>  
                    <View style={{borderColor:'#fff',borderWidth:1,height:padding}} />
                    
                    <MainHeader
                        handleSearch={this.handleOpenSearch}
                        handleSidebar={this.handleOpenSidebar}
                        handlePop={handleMainPop} />
                    
                </View>
                {this.state.searchNavigator.status ? (<SearchComponent navigator={this.state.searchNavigator} headerPos={headerPos}/>) : null}
                {musicHandler.info.playingAlbumID < 0 ? null :(<PlayingPage headerPos={headerPos} musicHandler={musicHandler} myplaylistHandler={myplaylistHandler}/>)}
                
                <Sidebar
                    auth={this.props.auth}
                    register={this.registerSidebarNavigator}
                    handleMainPush={handleMainPush}
                    handleWholePush={handleWholePush}
                />

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
    },*/
    hideBottomPadding:{
        height:100,
        width:'100%',
    },

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
