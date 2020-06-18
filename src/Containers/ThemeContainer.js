import React, {Component} from 'react'
import { StyleSheet, View, Text, ScrollView, Animated, TouchableOpacity, Dimensions} from 'react-native'
import { Music } from '../NetworkHandler'
const {width} = Dimensions.get('window')


export default class ThemeContainer extends Component{
    constructor(props){
        super(props)
        this.state={list:[], isLoaded:false}
    }
    componentDidMount(){
        setTimeout(this.LoadThemelist,1000)
    }
    LoadThemelist = async()=>{
        const result = await Music.getMainThemeList()
        //TODO: fix result.result => result.data
        return !result || !result.success || !result.result ?
            this.setState({list:[], isLoaded:true}) :
            this.setState({list:result.result, isLoaded:true})
    }
    CloseNotice = ()=> Animated.timing(this.translatedY,{
                toValue:-43,
                duration:200,
                useNativeDriver:true
            }).start()
    OpenNotice = ()=> Animated.timing(this.translatedY,{
                toValue:0,
                duration:100,
                useNativeDriver:true
            }).start()
    translatedY = new Animated.Value(0)
    
    render(){
        const {isLoaded} = this.state
        return(
            <View style={styles.container}>
                <Animated.View style={[styles.noticeContainer, {transform:[{translateY: this.translatedY}]}]}>
                    <Text style={styles.noticeText} allowFontScaling={false}>Welcome to Mael play</Text>
                </Animated.View>
                <View style={styles.topPadding}/>
                <ScrollView style={[styles.scroll, {opacity:isLoaded?'100%':'50%'}]}
                    onMomentumScrollEnd={({nativeEvent})=>nativeEvent.contentOffset.y === 0 ? this.OpenNotice() : null}
                    onScrollBeginDrag={this.CloseNotice} >
                        { isLoaded ? this.state.list.map( item => item.list && item.list.length > 0 ?
                            (<LowGroup
                                key={item.ID}
                                ID={item.ID}
                                list={item.list}
                                title={item.title}
                                subTitle={item.subTitle}
                                navigator={this.props.navigator}
                            />) : null ) : (<Text style={styles.loadingText}>로딩중...</Text>)
                        }
                    <View style={{height:30}} />
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    // CONTAINER
    container:{
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },
    noticeContainer:{
        position:'absolute',
        width:'100%',
        height:43,
        backgroundColor:'#2f2d2d',
        justifyContent:'center',
        top:0
    },
    noticeText:{
        fontSize:14,
        color:'#70e255',
        textAlign:'center'
    },
    topPadding:{
        height:10
    },
    loadingText:{
        alignSelf:'center',
        top:70,
        fontSize:30
    },
    scroll:{
        width:'100%'
    }
})


class LowGroup extends Component{
    render(){
        const { title, subTitle, navigator } = this.props
        const albums = this.props.list.map( item => (
                    <Album key={item.ID}
                        albumID={item.ID}
                        title={item.title}
                        artist={item.artist}
                        navigator={navigator}
                    />)
                )
        return(
            <View style={containerStyle.container}>
                <View style={containerStyle.titleContainer}>
                    <Text style={containerStyle.title} numberOfLines={1}>
                        {title}
                    </Text>
                    <Text style={containerStyle.subTitle}>
                        {subTitle}
                    </Text>
                </View>

                <View style={containerStyle.themeContainer}>
                    <ScrollView style={containerStyle.scroll}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <View style={containerStyle.itemPadding}/>
                            { albums }
                        <View style={containerStyle.itemPadding}/>
                    </ScrollView>
                </View>
                <View style={containerStyle.bottomPaddingContainer}>
                    <View style={containerStyle.bottomPadding} />
                </View>
            </View>
        )
    }
}


const containerStyle = StyleSheet.create({
    // CONTAINER
    container:{
        alignItems: 'center',
        width: '100%',
        height: width*0.7,
        marginTop:40
    },
    
    // TITLE
    titleContainer:{
        width: '100%',
        height:45,
    },
    title:{
        paddingLeft: 20,
        fontSize: 18,
        fontWeight: "bold",
        paddingBottom:3
    },
    subTitle:{
        color:'#767171',
        fontSize:10,
        paddingLeft:20,
    },

    // MAIN CONTENTS
    themeContainer:{
        width:'100%',
        flex:1
    },

    //PADDING
    bottomPaddingContainer:{
        height:0,
        width:'100%',
        paddingLeft:20,
        paddingRight:20,
    },
    bottomPadding:{
        paddingTop:5,
        height: 22,
        width:'100%',
        borderBottomWidth:1,
        borderBottomColor:'#ccc'
    },
    itemPadding:{
        width:10,
        height:'100%'
    }
})

//<AlbumArt style={itemStyle.imageContainer}
//url="class.jpeg"
///>
class Album extends Component{
    render(){
        const {title, albumID, artist, navigator} = this.props
        return(
            <TouchableOpacity style={itemStyle.container}
                onPress={()=>navigator.push('Albumcontainer',{albumID})}>
                <View style={[itemStyle.imageContainer, {borderColor:'black', borderWidth:1}]} />
                <View style={itemStyle.titleContainer}>
                    <Text style={itemStyle.title} numberOfLines={1}>
                        {title}
                    </Text>
                </View>

                <View style={itemStyle.subtitleContainer}>
                    <Text style={itemStyle.subtitle} numberOfLines={1}>
                        {artist}
                    </Text>
                </View>

            </TouchableOpacity>
        )
    }
}




const itemStyle = StyleSheet.create({
    container:{
        width:width*0.45,
        height:'100%',
        marginLeft:10,
        justifyContent:'center',
        alignItems:'center',
    },
    imageContainer:{
        width:width*0.45,
        height:width*0.45,
        marginTop:10
    },

    image:{
        width:0,
        height:0,
        resizeMode:'contain'
    },


    titleContainer:{
        width:'100%',
        paddingTop:5
    },
    title:{
        fontSize: 16,
        color:'#121111',
        fontWeight:'400'
    },

    subtitleContainer:{
        flex:1,
        width:'100%',
        paddingTop:0
    },
    subtitle:{
        fontSize: 14,
        color:'#8d8989'
    },
})
