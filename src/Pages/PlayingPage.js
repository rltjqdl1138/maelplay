import React, {Component} from 'react'
import {View, StyleSheet, Animated, PanResponder, Dimensions, Text, TouchableOpacity, Image, ScrollView} from 'react-native'
import MiniPlaybar from '../Components/Miniplaybar'
import {AlbumItem, MyplaylistItem} from '../Components/MusicInfoItem'
//import PlayingContainer from '../containers/PlayingContainer'
//import MiniPlaybar from '../components/MiniPlaybar'
//import { AudioActions  } from '../store/actionCreator'
//import deviceCheck from '../deviceCheck'

const minibarSize = 120

export default class PlayingPage extends Component{
    constructor(props){
        super(props)
        this.state = {isOpen:false}
    }
    // Positions
    screenHeight = Dimensions.get('window').height
    scrollDownPos = this.screenHeight-125
    headerPos = -minibarSize

    // Animated Values
    minibarOpacity = new Animated.Value(1)
    translatedY = new Animated.Value(this.scrollDownPos)

    // PanResponder
    _panResponder = PanResponder.create({
        onStartShouldSetPanResponder: ({nativeEvent}, gestureState) =>{
            const {isOpen} = this.state
            if(isOpen && nativeEvent.pageY < this.screenHeight * 0.2)
                return true
            
            else if(isOpen)
                return false
            
            return true
            
        },
        onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            const {pageY} = evt.nativeEvent
            const {dy, vy} = gestureState
            const {isOpen} = this.state
            if( isOpen && dy > 50 && vy > 0.5 && pageY < this.screenHeight * 0.4 ) return true
            else if(isOpen) return false
            else if(dy < -10 && vy < -0.5)
                return true
            return false
        },
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
        onPanResponderGrant: (evt, gestureState) => {},
        onPanResponderMove:({nativeEvent}, gestureState) => {

            const {isOpen} = this.state
            if(gestureState.dy < 40 && gestureState.dy > -40) return false
            const height = Dimensions.get('window').height
            this.minibarOpacity.setValue(gestureState.moveY/height)
            if(isOpen)
                this.translatedY.setValue(gestureState.dy + this.headerPos)
            else 
                this.translatedY.setValue(gestureState.dy + this.scrollDownPos)
        },
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        
        onPanResponderRelease: (e, {vy, dy}) => {
            const {isOpen} = this.state
            // The user has released all touches while this view is the
            // responder. This typically means a gesture has succeeded
            if(!isOpen && (dy < -400 || vy < -0.8)){
                Animated.timing(this.minibarOpacity,{
                    toValue:0
                }).start()
                Animated.timing(this.translatedY, {
                    toValue: this.headerPos,
                    duration:200
                }).start(()=>{
                    this.setState({isOpen:true})
                })
            }else if(!isOpen){
                Animated.timing(this.minibarOpacity,{
                    toValue:1
                }).start()
                Animated.timing(this.translatedY, {
                    toValue: this.screenHeight
                }).start(()=>{
                    //AudioActions.ending()
                    this.translatedY.setValue(this.scrollDownPos)
                })
            }


            else if(isOpen && dy > 100){
                this.setState({isOpen:false})
                Animated.timing(this.minibarOpacity,{
                    toValue:1
                }).start()
                Animated.timing(this.translatedY, {
                    toValue: this.scrollDownPos,
                    duration:200
                }).start()


            }else if(isOpen){
                Animated.timing(this.minibarOpacity,{
                    toValue:0
                }).start()
                Animated.spring(this.translatedY, {
                    toValue: this.headerPos,
                    bounciness:12
                }).start()
            }
        },
        onPanResponderTerminate: (evt, gestureState) => {
          // Another component has become the responder, so this gesture
          // should be cancelled
            const {isOpen} = this.state

            if(isOpen){
                this.setState({isOpen:false})
                Animated.timing(this.minibarOpacity,{
                    toValue:1
                }).start()
                Animated.timing(this.translatedY, {
                    toValue: this.scrollDownPos,
                    duration: 400
                }).start()
            }else{
                Animated.timing(this.minibarOpacity,{
                    toValue:1
                }).start()
                Animated.timing(this.translatedY, {
                    toValue: this.scrollDownPos,
                    duration:200
                }).start()
            }
        },
        onShouldBlockNativeResponder: (evt, gestureState) => {
          // Returns whether this component should block native components from becoming the JS
          // responder. Returns true by default. Is currently only supported on android.
          return true;
        },
    })
    getStyle(){
        return [WholeStyle.container, {transform: [{translateY: this.translatedY}]}]
    }
    getMinibarStyle(){
        return [WholeStyle.mini, {opacity: this.minibarOpacity}]
    }
    render(){
        //const {isPlaying, showPlaybar, playlist, albumID, playOption, index, isLogin, token, isLoaded, isUpdated } = this.props
        //const albumInfo = this.props.albumInfo ? this.props.albumInfo : {ID:0, title:'My Playlist'}

        return(
            <Animated.View style={this.getStyle()}
                {...this._panResponder.panHandlers} >
                <Animated.View style={this.getMinibarStyle()}>
                    <MiniPlaybar minibarSize={minibarSize}
                        musicHandler={this.props.musicHandler}/>
                </Animated.View>
                <View style={WholeStyle.main} >
                    <View style={{height:50, backgroundColor:'#fff'}}/>
                    <View style={{height:10, backgroundColor:'#fff', alignItems:'center'}}>
                        <Image style={{flex:1,resizeMode:'contain'}} source={require('../../assets/icons/scrollDown.png')} />
                    </View>
                    <MainPlayerContainer musicHandler={this.props.musicHandler}/>
                </View>
                <View style={WholeStyle.bottomPadding} />
            </Animated.View>
        )
    }
}

const WholeStyle=StyleSheet.create({
    container:{
        position:'absolute',
        left:0,
        width:'100%',
        height:'200%',
        borderColor:'black',
        borderWidth:1
        //display:'none'
    },
    mini:{
        height:minibarSize,
    },
    main:{
        width:'100%',
        height:'50%',
        backgroundColor:'#fff'
    },
    bottomPadding:{
        width:'100%',
        flex: 1,
        backgroundColor:'#fff'
    }
    
})


//import networkHandler from '../networkHandler'
//import CacheManager from '../CacheManager'
//import {AudioActions, MyPlaylistActions} from '../store/actionCreator'
//import MusicPlayList from '../components/MusicPlayList'
const {width, height} = Dimensions.get('window')
const minibarPos = height - 180

class MainPlayerContainer extends Component {
    translatedY = new Animated.Value(minibarPos)
    handleAddPlaylist(items){
        /*
        const {myPlaylist} = this.props
        const itemlist = items.map((item,index)=>{
            const albumTitle = this.state.albumInfo ? this.state.albumInfo.title : undefined
            const checkOverlap = (element) => element.ID === item.ID
            const isOverlap = myPlaylist.findIndex(checkOverlap)
            if(isOverlap < 0)
                return {...item, index:myPlaylist.length+index+1, albumTitle}
            return {...item, ID:Date.now() + ':' +item.ID, index:myPlaylist.length+index+1,
                albumTitle}
        })
        const result = [...myPlaylist, ...itemlist]
        MyPlaylistActions.update({list:result})
        if(this.props.playingAlbumID===0)
            AudioActions.update({albumID:0, list:result, index:this.props.index})
        */
    }
    handleOpenMinibar = ()=>{
        Animated.timing(this.translatedY, {
            toValue: minibarPos,
            duration: 400
        }).start()
    }
    handleCloseMinibar = ()=>{
        Animated.timing(this.translatedY, {
            toValue: height,
            duration: 200
        }).start()
    }
    handleClick = (index)=>{
        (async()=>{
            const {info, load, resume, pause } = this.props.musicHandler
            if(index === info.playingIndex)
                return info.isPlaying ? await pause() : await resume()
            return await load( index===undefined ? 0 : index)
        })()
    }
    getAlbumArt = () =>{
        const {info} = this.props.musicHandler
        return (
            <View style={styles.albumContainer}>
                <View style={styles.albumArtContainer}>
                    <Text>{info.playingAlbum.uri+'.jpg'}</Text>
                    {/*
                    <Image style={styles.circle}
                        source={require('../image/circle.jpg')}
                    />
                    <Image style={styles.albumArt}
                        source={require('../image/owl2.jpg')}
                    />
                    */}
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        {info.playingAlbum.title}
                    </Text>
                    <Text style={styles.artist}>
                        {info.playingAlbum.artist}
                    </Text>
                </View>

                <TouchableOpacity style={{width:18, paddingTop:8, paddingRight:0}}
                        onPress={()=>{this.handleAddPlaylist(info.playlist); alert('리스트에 추가되었습니다') }} >
                        <Image style={{width:13,height:13,resizeMode:'cover'}}
                            source={require('../../assets/icons/add.png')} />
                </TouchableOpacity>
                
            </View>)
    }
    render(){
        const {info, next, pause} = this.props.musicHandler
        const index = info.playingIndex
        const albumID = info.playingAlbumID
        const list = info.playlist.map((item,index)=> albumID === 0 ?
            (<MyplaylistItem key={index}
                handleClick={this.handleClick}
                isPlaying={index===info.playingIndex}
                index={index}
                uri={item.uri}
                title={item.title}
                info={item.info} />
            ):(
            <AlbumItem key={index}
                handleClick={this.handleClick}
                isPlaying={index===info.playingIndex}
                index={index}
                uri={item.uri}
                title={item.title}
                info={item.info} />
            ))
        return (
            <View style={styles.container}>
                <ScrollView style={styles.scroll}
                    showsHorizontalScrollIndicator={false}
                    onScrollBeginDrag={this.handleCloseMinibar}
                    onScrollEndDrag={this.handleOpenMinibar} >
                    {this.getAlbumArt()}
                    <View style={styles.paddingContainer}>
                        <View style={styles.paddingTitleContainer}>
                            <Text style={styles.paddingText}>Sound List</Text>
                        </View>
                        <View style={styles.optionContainer}>
                            <TouchableOpacity style={[styles.optionButtonContainer, {backgroundColor:info.playOption===0?'red':'#fff'}]}
                                onPress={()=>{}} >
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.optionButtonContainer, {backgroundColor:info.playOption===1?'red':'#fff'}]}
                                onPress={()=>{}} >
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.optionButtonContainer, {backgroundColor:info.playOption===2?'red':'#fff'}]}
                                onPress={()=>{}} >
                            </TouchableOpacity>
                        </View>
                    </View>
                    {list}

                    <Animated.View
                        style={[styles.minibarContainer, {transform: [{translateY: this.translatedY}]}]}>
                        <View style={{height:60, width:'100%', flexDirection:'row'}}>
                            <TouchableOpacity style={styles.minibarImageContainer}
                                onPress={()=>{next(index-1)}}>
                                <Image style={styles.minibarImage}
                                    source={require('../../assets/icons/previous.png')}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.minibarImageContainer}
                                onPress={()=>{pause()}}>
                                <Image style={styles.minibarImage}
                                    source={require('../../assets/icons/pause.png')}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.minibarImageContainer}
                                onPress={()=>{next()}}>
                                <Image style={styles.minibarImage}
                                    source={require('../../assets/icons/next.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        height:'100%',
        backgroundColor:'#fff',
        alignItems: 'center',
        paddingLeft:20,
        paddingRight:20,
        paddingTop:15
    },
    scroll:{
        width:'100%',
        height:'100%'
    },

    // ALBUM ART
    albumContainer:{
        height:width*0.35,
        width:'100%',
        flexDirection:'row',
        borderBottomWidth:0.3,
        borderBottomColor:'#555'
    },
    albumArtContainer:{
        width:width*0.3,
        height:width*0.3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'green'
    },
    circle:{
        position:'absolute',
        width:'100%',
        height:'100%',
        resizeMode:'contain',
        borderColor:'black',
        borderWidth:1,
    },
    albumArt:{
        position:'absolute',
        width:'50%',
        height:'50%',
        resizeMode:'contain',
    },

    // TITLE
    titleContainer:{
        flex:1,
        paddingTop:4,
        paddingBottom:20,
        paddingLeft:20
    },
    artist:{
        fontSize:13,
        color:'#767171',
        marginTop:2
    },
    title:{
        fontSize:18,
        fontWeight:'600'
    },
    
    paddingContainer:{
        width:'100%',
        height:63,
        paddingBottom:3,
        flexDirection:'row',
    },
    paddingTitleContainer:{
        flex:3,
        justifyContent:'center'
    },
    albumText:{
        color:'#121111',
        fontSize:16,
        fontWeight:'600'
    },
    paddingText:{
        marginTop:2,
        color:'#121111',
        fontSize:15
    },
    optionContainer:{
        flex:2,
        flexDirection:'row'
    },
    optionButtonContainer:{
        flex:1,
        borderColor:'#000',
        borderWidth:1
    },
    minibarContainer:{
        position:'absolute',
        paddingLeft:'20%',
        paddingRight:'20%',
        width:'100%',
        height:minibarSize,
        flexDirection:'row',
        alignItems:'center'
    },
    minibarImageContainer:{
        flex:1,
        height:'70%',
        alignItems:'center',
        justifyContent:'center',
    },
    minibarImage:{
        resizeMode:'contain',
        flex:1
    }
})
