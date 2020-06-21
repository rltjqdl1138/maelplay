import React, {Component} from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image, Animated, PanResponder, Dimensions } from 'react-native'
const screenWidth = Dimensions.get("window").width;
const BOX_POS = screenWidth - 150
const BOX_SIZE = 120

exports.AlbumItem = class AlbumItem extends Component{
    constructor(props){
        super(props)
        this.state={isOpen:false}
    }
    toggleInfo=()=>this.setState({isOpen:!this.state.isOpen})
    render(){
        const {isOpen} = this.state
        const {isPlaying, index, title, uri, handleClick} = this.props
        return (
            <View style={itemStyle} >
                <View style={itemStyle.topPadding} />
                <TouchableOpacity style={itemStyle.mainContainer} onPress={()=>handleClick(index)}>
                    <View style={itemStyle.indexContainer}>
                        {
                            // Index
                            !isPlaying ? ( <Text style={itemStyle.indexText}> {index+1} </Text>):
                                (<Image style={itemStyle.indexImage}
                                    source={require('../../assets/icons/nowPlaying.png')}/>)
                        }
                    </View>
                    <View style={itemStyle.titleContainer}>
                        <Text style={itemStyle.title}>{title}</Text>
                    </View>
                    <View style={itemStyle.openButtonContainer}>
                        <TouchableOpacity style={itemStyle.openButton} onPress={this.toggleInfo}>
                            <Image style={itemStyle.openButtonImage} source={require('../../assets/icons/lyric.png')}/>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>

                <View style={[itemStyle.lyricContainer, {display:isOpen?'flex':'none'}]}>
                    <View style={itemStyle.topPaddingInLyric}/>
                    <Text style={itemStyle.lyric} >
                        {isOpen ? this.props.info : null}
                    </Text>
                </View>
                <View style={itemStyle.bottomPadding} />
            </View>
        )
    }
}

exports.MyplaylistItem = class MyplaylistItem extends Component{
    constructor(props){
        super(props)
        this.state={isOpen:false}
    }
    isOpen=false
    translateX = new Animated.Value(screenWidth);
    openOption = ()=>{
        Animated.timing(this.translateX, {
            toValue: BOX_POS,
            duration: 200
        }).start();
        this.isOpen = true
    }
    closeOption = ()=>{
        Animated.timing(this.translateX, {
            toValue: screenWidth,
            duration: 200
        }).start();
        this.isOpen = false
    }
    _panResponder = PanResponder.create({
        onMoveShouldSetResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: () => true,
        onPanResponderMove: (e, {dx})=> (this.isOpen && dx < -70) || (!this.isOpen && dx < -170) ? true : 
                this.translateX.setValue(dx + (this.isOpen ? BOX_POS : screenWidth)) ,
        onPanResponderRelease: (e, {vx, dx}) => {
            if(this.isOpen){
                if ( vx >= 0.2 || dx >= 0.2 * screenWidth) 
                    this.closeOption()
                else
                    Animated.spring(this.translateX, {
                        toValue: BOX_POS,
                        bounciness: 10
                    }).start();
            }else if ( vx <= -0.1 || dx <= -0.2 * screenWidth)
                this.openOption()
            else {
                Animated.spring(this.translateX, {
                    toValue: screenWidth,
                    bounciness:10
                }).start();
            }
        },
        onPanResponderTerminate: (e, {vx, dx}) =>{
            if(this.isOpen){
                if ( vx >= 0.2 && dx >= 0.2 * screenWidth) {
                    Animated.timing(this.translateX, {
                        toValue: screenWidth,
                        duration: 200
                    }).start(this.props.onDismiss);
                    this.isOpen = false
                }else{
                    Animated.spring(this.translateX, {
                        toValue: BOX_POS,
                        bounciness: 10
                    }).start();
                }

            }else if ( vx <= -0.1 && dx <= -0.2 * screenWidth) {
                    Animated.timing(this.translateX, {
                        toValue: BOX_POS,
                        duration: 200
                    }).start(this.props.onDismiss);

                    this.isOpen = true
            }else {
                Animated.spring(this.translateX, {
                    toValue: screenWidth,
                    bounciness:10
                }).start(this.props.onDismiss);
            }
        }
    });
    toggleInfo=()=>this.setState({isOpen:!this.state.isOpen})
    render(){
        const {isOpen} = this.state
        const {isPlaying, index, title, handleClick} = this.props
        return (
            <View style={itemStyle} {...this._panResponder.panHandlers}>
                <View style={itemStyle.topPadding} />
                <TouchableOpacity style={itemStyle.mainContainer} onPress={()=>this.isOpen?this.closeOption():handleClick(index)}>
                    <View style={itemStyle.indexContainer}>
                        {
                            // Index
                            !isPlaying ? ( <Text style={itemStyle.indexText}> {index+1} </Text>):
                                (<Image style={itemStyle.indexImage}
                                    source={require('../../assets/icons/nowPlaying.png')}/>)
                        }
                    </View>
                    <View style={itemStyle.titleContainer}>
                        <Text style={itemStyle.title}>{title}</Text>
                    </View>
                    <View style={itemStyle.openButtonContainer}>
                        <TouchableOpacity style={itemStyle.openButton} onPress={this.toggleInfo}>
                            <Image style={itemStyle.openButtonImage} source={require('../../assets/icons/lyric.png')}/>
                        </TouchableOpacity>
                    </View>

                    <Animated.View style={[itemStyle.animationContainer,{transform: [{translateX: this.translateX}]} ]}>
                            <View style={{width:40, height:'100%'}}>
                                <TouchableOpacity style={{flex:1}}>
                                    
                                </TouchableOpacity>
                                <TouchableOpacity style={{flex:1}}>

                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={()=>{ this.closeOption(); this.props.handleDeletePlaylist(index)}}
                                style={{flex:1,backgroundColor:'#FF6E43', justifyContent:'center'}}>
                                    <Text style={{textAlign:'center',fontSize:13, color:'white'}}>Delete</Text>
                            </TouchableOpacity>
                        </Animated.View>
                </TouchableOpacity>

                <View style={[itemStyle.lyricContainer, {display:isOpen?'flex':'none'}]}>
                    <View style={itemStyle.topPaddingInLyric}/>
                    <Text style={itemStyle.lyric} >
                        {isOpen ? this.props.info : null}
                    </Text>
                </View>
                <View style={itemStyle.bottomPadding} />
            </View>
        )
    }
}

const itemStyle = StyleSheet.create({
    container:{
        width:'100%',
        justifyContent:"center",
        alignItems:'center',
        backgroundColor:'#fff'
    },
    mainContainer:{
        flexDirection:'row',
        flex:1,
    },
    indexContainer:{
        height:'100%',
        width:30,
        justifyContent:'center',
        alignItems:'center'
    },
    indexText:{
        color:'#121111',
        fontSize:15,
        color:'#767171',
        textAlign:'center'
    },
    indexImage:{
        width:'50%',
        height:'50%',
        resizeMode:'contain'
    },
    titleContainer:{
        height:'100%',
        flex:1,
        paddingLeft:10,
        justifyContent:'center'
    },
    title:{
        fontSize:16,
        color:'#121111'
    },
    artist:{
        fontSize:14,
        color:'#767171',
        marginTop:1
    },
    chooseTitle:{
        fontSize:16,
        color:'#121111',
        fontWeight:'900'
    },
    openButtonContainer:{
        height:40,
        width:40,
        alignSelf:'center'
    },
    openButton:{
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center'
    },
    openButtonImage:{
        width:20,
        height:20,
        resizeMode:'contain'
    },

    lyricContainer:{
        width:'80%',
        justifyContent:"center",
        alignSelf:'center'
    },
    lyric:{
        fontSize:13,
        textAlign:'center',
        lineHeight:20
    },
    topPadding:{
        width:'100%',
        height:10,
    },
    topPaddingInLyric:{
        width:'100%',
        height:10,
        borderTopColor:'#EAE8E8',
        borderTopWidth:0.8
    },
    bottomPadding:{
        width:'100%',
        height:10,
        borderBottomColor:'#EAE8E8',
        borderBottomWidth:0.8
    },


    animationContainer:{
        width:120,
        height:'100%',
        position:'absolute',
        backgroundColor:'#fff',
        flexDirection:'row',
        borderColor:'black',
        borderWidth:1
    }
})
