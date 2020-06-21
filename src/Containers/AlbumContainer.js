import React, {Component} from 'react'
import { View, TouchableOpacity, StyleSheet, Text, Image, ScrollView, Dimensions } from 'react-native'
import {Music} from '../NetworkHandler'
import {AlbumItem, MyplaylistItem} from '../Components/MusicInfoItem'
//import networkHandler from '../networkHandler'
//import CacheManager from '../CacheManager'
//import {AudioActions, MyPlaylistActions} from '../store/actionCreator'
//import MusicPlayList from '../components/MusicPlayList'
const {width} = Dimensions.get('window')

export default class AlbumContainer extends Component {
    constructor(props){
        super(props)
        this.state = {
            isLoaded:false,
            musicPlaylist: [],
            albumInfo:{}
        }
    }
    componentDidMount(){
        const {albumID} = this.props.config;
        if(!this.props.handler.Music || !this.props.handler.Myplaylist)
            return navigator.pop()
        if(albumID === 0){
            this.loadMyPlaylist()
            this.props.handler.Myplaylist.setHandler(this.loadMyPlaylist)
        }
        else
            (async()=>{
                const data1 = await Music.getAlbum(albumID)
                const data2 = await Music.getMusicList(albumID)
                if(!data1 || !data1.success || !data2 || !data2.success)
                    return console.warn(data1)
                else{
                    this.setState(state=>({
                        ...state,
                        isLoaded: true,
                        albumInfo: data1.data[0],
                        musicPlaylist: data2.data }))
                    }
            })()
    }
    componentWillUnmount(){
        this.props.handler.Myplaylist.setHandler(()=>{})
    }
    loadMyPlaylist = async ()=>
        this.setState(state=>({
            isLoaded:true,
            albumInfo: {ID:0, title:'My Playlist'},
            musicPlaylist: this.props.handler.Myplaylist.info ? this.props.handler.Myplaylist.info : []
        }))
    
    handleAddPlaylist = async ()=>{
        const { Myplaylist } = this.props.handler
        const result = await Myplaylist.append(this.state.musicPlaylist)
        result.success ? alert(result.data + '곡이 추가되었습니다.'): null
        
    }
    handleDeletePlaylist = async (index)=>{
        await this.props.handler.Myplaylist.remove(index)
    }
    
    
    handleClick = (index)=>{
        (async()=>{
            const {musicPlaylist, albumInfo} = this.state
            const {info, load, resume, pause, update} = this.props.handler.Music
           
            if(info.playingAlbumID === this.props.config.albumID && index === info.playingIndex)
                return info.isPlaying ? await pause() : await resume()
            
            info.playingAlbumID !== this.props.config.albumID ? await update(musicPlaylist, albumInfo) : null
            return await load( index===undefined ? 0 : index)
        })()
    }
    getAlbumArt = () =>{
        const {albumInfo} = this.state
        return (
            <View style={styles.albumContainer}>
                <View style={styles.albumArtContainer}>
                    <Text>{albumInfo.uri+'.jpg'}</Text>
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
                        {albumInfo.title}
                    </Text>
                    <Text style={styles.artist}>
                        {albumInfo.artist}
                    </Text>
                </View>
                {albumInfo.ID ? this.getAddButton() : null}
            </View>)
    }
    getAddButton = ()=>{
        return (
            <TouchableOpacity style={{width:18, paddingTop:8, paddingRight:0}}
                onPress={()=>this.handleAddPlaylist()} >
                <Image style={{width:13,height:13,resizeMode:'cover'}}
                    source={require('../../assets/icons/add.png')} />
            </TouchableOpacity>
        )
    }
    render(){
        const {isLoaded, musicPlaylist, albumInfo} = this.state
        const info = this.props.handler && this.props.handler.Music ? this.props.handler.Music.info : {}
        const {playingAlbumID} = this.props.handler
        const isDisabled = info.playingAlbumID === albumInfo.ID
        const list = musicPlaylist.map((item,index)=>albumInfo.ID === 0 ?
            (<MyplaylistItem key={index}
                handleClick={this.handleClick}
                handleDeletePlaylist={this.handleDeletePlaylist}
                isPlaying={index===info.playingIndex && albumInfo.ID === playingAlbumID}
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
                    showsHorizontalScrollIndicator={false}>
                    {isLoaded ? this.getAlbumArt() : null}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.playButtonContainer,{opacity:isDisabled?0.5:1}]}
                            disabled={isDisabled}
                            onPress={()=>this.handleClick(0)}>
                            <Image source={require('../../assets/icons/playbutton.png')}
                                style={styles.playButton}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shffleButtonContainer}
                            onPress={()=>this.handleClick()}>
                            <Image source={require('../../assets/icons/shufflebutton.png')}
                                style={styles.shffleButton}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.paddingContainer}>
                        <Text style={styles.paddingText}>Sound List</Text>
                    </View>
                    {list}
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
        height:width*0.38,
        backgroundColor:'#fff',
        width:'100%',
        flexDirection:'row'
    },
    albumArtContainer:{
        width:width*0.38,
        height:width*0.38,
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
    buttonContainer:{
        marginTop:20,
        height:width/6,
        width:'100%',
        flexDirection:'row',
        justifyContent:'center'
    },
    playButtonContainer:{
        flex:1,
        paddingRight:7
    },
    shffleButtonContainer:{
        flex:1,
        paddingLeft:7
    },
    playButton:{
        height:'100%',
        width:'100%',
        resizeMode:'contain'
    },
    shffleButton:{
        height:'100%',
        width:'100%',
        resizeMode:'contain'

    },
    paddingContainer:{
        paddingTop:15,
        height:45,
    },
    paddingText:{
        fontWeight:'normal',
        color:'#121111',
        //color:'#767171'
    }
})
