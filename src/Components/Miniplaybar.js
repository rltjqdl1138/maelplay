import React, {Component} from 'react'
import {View, StyleSheet, Text, TouchableOpacity, Image, Dimensions, ProgressViewIOS, PanResponder} from 'react-native'
//import PlayingBar from './PlayingBar'
const {width} = Dimensions.get('window')

export default class MiniPlayingbar extends Component{
    constructor(props){
        super(props)
        this.state = {ms:0}
    }
    PlayButton = (props)=>{
        return props.isPlaying ? (
            <TouchableOpacity style={styles.buttonItem}
                onPress={()=>{props.pause()}}>
                    <Image style={styles.buttonItemImage}
                        source={require('../../assets/icons/pause.png')} />
            </TouchableOpacity>) : (
            <TouchableOpacity style={styles.buttonItem}
                onPress={()=>{props.resume()}} >
                    <Image style={styles.buttonItemImage}
                        source={require('../../assets/icons/play.png')} />
            </TouchableOpacity>)
    }
    render(){
        const {PlayButton} = this
        const {minibarSize, musicHandler} = this.props
        const playInfo = musicHandler.info ? musicHandler.info.playlist[musicHandler.info.playingIndex] : {title:''}
        const albumInfo = musicHandler.info ? musicHandler.info.playingAlbum : {title:''}

        return(
            <View style={styles.container}>
                <View style={styles.playingbarContainer}>
                    <PlayingBar musicHandler={musicHandler}/>
                </View>
                <View style={styles.mainContainer}>
                    <View style={styles.leftPadding}/>
                    <View style={[styles.albumContainer,{height:minibarSize-40, width:minibarSize-40, backgroundColor:'green'}]}>
                        {/*<Image style={styles.circle} 
                            source={require('../image/circle2.jpg')}  />
                        <Image style={styles.albumImage}
                            source={require('../image/owl2.jpg')}  />*/}
                    </View>

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{playInfo?playInfo.title:''}</Text>
                        <Text style={styles.albumTitle}>{albumInfo ? albumInfo.title:''}</Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <View style={styles.controllerContainer}>
                            <View style={styles.leftPadding}/>
                            
                            <PlayButton
                                pause={musicHandler.pause}
                                resume={musicHandler.resume}
                                isPlaying={musicHandler.info.isPlaying}
                            />

                            <TouchableOpacity style={styles.buttonItem}
                                onPress={()=>{ musicHandler.next(undefined, true)}}>
                                    <Image style={styles.buttonItemImage}
                                        source={require('../../assets/icons/next.png')} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.buttonItem}
                                disabled={!albumInfo.ID}
                                onPress={()=>this.props.myplaylistHandler.append(playInfo)}>
                                    <Image style={styles.addItemImage}
                                        source={require('../../assets/icons/add.png')} />
                            </TouchableOpacity>

                            <View style={styles.rightPadding}/>
                        </View>
                    </View>
                    <View style={styles.rightPadding}/>
                </View>
            </View>
        )
    }
}

const styles= StyleSheet.create({
    container:{
        width:'100%',
        height:'100%',
        backgroundColor:'#fff'
    },
    playingbarContainer:{
        height:10,
        width:'100%',
    },
    mainContainer:{
        flex:1,
        width:'100%',
        flexDirection:'row',
        backgroundColor:'#ddd',

        backgroundColor:'#F2EFEF',
    },

    leftPadding:{
        left:0,
        height:'100%',
        width:'6%',
    },
    rightPadding:{
        right:0,
        height:'100%',
        width:10
    },


    albumContainer:{
        alignSelf:'center',
        justifyContent:'center',
        alignItems:'center',
    },
    albumImage:{
        position:'absolute',
        height:'40%',
        width:'40%',
        resizeMode:'contain'
    },
    circle:{
        position:'absolute',
        height:'100%',
        width:'100%',
        resizeMode:'contain'
    },


    titleContainer:{
        flex:1,
        justifyContent:'center',
        paddingLeft:20
    },
    title:{
        fontSize:15,
        fontWeight:'bold',
        color:'#121111'
    },
    albumTitle:{
        fontSize:10,
        color:'#767171'
    },

    buttonContainer:{
        width:140,
        height:'100%',
        flexDirection:'column',
        height:'80%',
        alignSelf:'center'
    },
    controllerContainer:{
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    
    buttonTestItem:{
        flex:1,
        height:'100%',
        borderWidth:1,
        borderColor:'#000',
        alignItems:'center',
        justifyContent:'center'
    },
    buttonItem:{
        flex:1,
        height:'100%',
        alignItems:'center',
        justifyContent:'center',
        paddingRight:10,
    },
    buttonItemImage:{
        width:'100%',
        height:'70%',
        resizeMode:'contain'
    },
    addItemImage:{
        width:'40%',
        height:'70%',
        resizeMode:'contain'
    },
})



class PlayingBar extends Component {
    constructor(props) {
      super(props);
      this.state = { progress: 0, isMoving: false, ms:1, duration:10000 }
      
      this._panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => this.handleChange('isMoving', true),
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderGrant: (evt, gestureState) => true,
        onPanResponderMove: (evt, gestureState) => this.handleChange('progress', gestureState.moveX / width),
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        onPanResponderRelease: (evt, gestureState) => this.jumping(this.state.progress * this.state.duration),
        onPanResponderTerminate: (evt, gestureState) => this.jumping(this.state.progress * this.state.duration),
        onShouldBlockNativeResponder: (evt, gestureState) => true,
      });
    }
    componentDidMount(){
        this.props.musicHandler.setHandler(this.onPlaybackStatusUpdate)
    }
    componentWillUnmount(){
        this.props.musicHandler.setHandler(()=>{})
    }

    handleChange = (field, text) => this.setState({ [field]: text });
    jumping = async (ms)=>{
        await this.props.musicHandler.jump(Math.floor(ms))
        this.handleChange('isMoving', false)
    }
    getProgressBar = () =>{
        const {isMoving, ms, progress, duration}= this.state
        const _progress = ms < duration ? ms/duration : 1
        return (
            <View style={{width:'100%',height:10,backgroundColor:'#fafafa'}}>
                <ProgressViewIOS progress={ isMoving || !ms || !this.props.musicHandler.info.isPlaying ? progress : _progress }/>
            </View>
        )
    }
    onPlaybackStatusUpdate = (playbackStatus) =>{
        const duration = playbackStatus.durationMillis ? playbackStatus.durationMillis : playbackStatus.playableDurationMillis
        if (!playbackStatus.isLoaded);
        else if(playbackStatus.didJustFinish)
            this.props.musicHandler.next()
        else if (playbackStatus.isPlaying && this.state.isMoving === false)
            this.setState(state=>({
                ...state,
                progress: playbackStatus.positionMillis / duration,
                ms: playbackStatus.positionMillis,
                duration
            }))
    }
    render(){
      return(
        <View style={BarStyle.container} {...this._panResponder.panHandlers}>
            { this.getProgressBar() }
        </View>)
    }
  }


const BarStyle= StyleSheet.create({
    container:{
        width:'100%',
        height:10
    },
    subContainer:{
      width:'100%',
      height:'100%',
      left:5,
      paddingLeft:10,
      paddingRight:10,
      position:'absolute'
    },
    downSideContainer:{
        position:'relative',
        height:20,
        width:'100%',
        backgroundColor:'#F2EFEF',
        alignItems:'flex-end',
        flexDirection:'row'
    }

})

/*

        return (<View style={{width:'100%',height:10, backgroundColor:color}}>
          <ProgressBarAndroid 
                  progress={ this.state.isMoving ? this.state.progress : time.ms/time.duration }
                  styleAttr="Horizontal"
                  indeterminate={false}/>
          </View>)*/