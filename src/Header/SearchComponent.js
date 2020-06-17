import React, {Component} from 'react'
import {StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, Text, TextInput, Image, Dimensions, Keyboard} from 'react-native'

const screenWidth = Dimensions.get('window').width
const MAX_CONTENTS = 7

export default class SearchComponent extends Component {
    constructor(props){
        super(props)
        this.state = {
            isKeyboardOpen: false,
            isSuggestLoaded:false,

            inputValue:'',
            suggestList:[],
        }
    }

    componentDidMount(){
		this._keyboardWillShowSubscription = Keyboard.addListener('keyboardDidShow', (e) => this._keyboardWillShow(e));
		this._keyboardWillHideSubscription = Keyboard.addListener('keyboardDidHide', (e) => this._keyboardWillHide(e));
    }
	componentWillUnmount() {
		this._keyboardWillShowSubscription.remove();
		this._keyboardWillHideSubscription.remove();
	}
	_keyboardWillShow=(e) => this.handleChange('isKeyboardOpen',true)
    _keyboardWillHide=(e)=> this.handleChange('isKeyboardOpen',false)
    
    handleChange = (field, text) => this.setState({ [field]: text });
    handleClose=()=> this.state.isKeyboardOpen ? Keyboard.dismiss():this.props.navigator.close()
    handleOpen=()=> this.props.navigator.open()

    handleSuggest = (text) =>{
        this.setState(state=>({
            ...state,
            inputValue: text,
            isSuggestLoaded:false
        }), this.getSuggestionList )
    }

    getSuggestionList = ()=>{
        //TODO: SERVER

        setTimeout(()=>{
            const item1 = {
                title: 'Hi hello how are you?',
                link: 'in Song'
            }
            const item2 = {
                title: 'Hide & Seek',
                link: 'in Song'
            }
            const item3 = {
                title: 'no name',
                link: 'in Album'
            }
            const item4 = {
                title: 'Very long name Very long name Very long name',
                link: 'in Lyric'
            }
            this.setState(state=>({
                ...state,
                isSuggestLoaded:true,
                suggestList: state.inputValue==='test'?
                    [item1, item2, item3, item4, item1, item2, item3, item4]:
                    [item1, item2, item3]
            }))
        },1000)
    }

    getSuggestion=()=>{
        const {suggestList, inputValue, isSuggestLoaded} = this.state
        if( inputValue === '' || suggestList.length === 0)
            return null
        else if(!isSuggestLoaded)
            return (
                <View style={styles.suggestContainer}>
                    <View style={styles.suggestTitleContainer}>
                        <Text style={styles.suggestTitleText}>Suggestion</Text>
                        <View style={styles.suggestTitlePadding} />
                    </View>

                    <Text style={{color:'#767171',alignSelf:'center'}}>Loading...</Text>
                </View>
            )
        return (
            <View style={styles.suggestContainer}>
                <View style={styles.suggestTitleContainer}>
                    <Text style={styles.suggestTitleText}>Suggestion</Text>
                    <View style={styles.suggestTitlePadding} />
                </View>
                <View style={{flex:1}}>
                    <SuggestItem list={suggestList} />
                </View>
            </View>
        )
    }
    render(){
        const {navigator, headerPos} = this.props
        const {suggestList, inputValue} = this.state
        const height = Math.min(suggestList.length , MAX_CONTENTS ) * 30 + 94
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={()=>this.handleClose()}>
                    <View style={styles.darkMask} />
                </TouchableWithoutFeedback>
                <View style={[styles.mainContainer,{top:headerPos-10, height: height}]}>
                    <View style={styles.searchContainer}>
                        <Image style={styles.searchImage} 
                            source={require('../../assets/icons/search.png')}/>
                        <TextInput
                            value={inputValue}
                            placeholder="검색어를 입력하세요"
                            style={styles.searchInput}
                            numberOfLines={1}
                            onChangeText={ text => this.handleSuggest(text)}/>
                    </View>
                    {this.getSuggestion()}
                </View>
            </View>
        )
    }
}
class SuggestItem extends Component{
    render(){
        const list = this.props.list.slice(0, MAX_CONTENTS)

        const SuggestItem = list.map( (item,index) =>{
            return(
                <TouchableOpacity key={index} style={styles.suggestContentContainer}>
                    <Image style={styles.searchImage} 
                        source={require('../../assets/icons/search.png')}/>
                    <Text style={styles.suggestContentText}
                        numberOfLines={1}>{item.title}</Text>
                    <View style={styles.suggestContentType}>
                        <Text style={styles.suggestContentTypeText}> {item.link} </Text>
                    </View>
                </TouchableOpacity>
            )
        })

        return(
            <View style={{flex:1}}>
                { SuggestItem }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        position:'absolute',
        width:'100%',
        height:'100%',
        alignItems:'center'
    },
    darkMask:{
        position:'absolute',
        width:'100%',
        height:'100%',
        backgroundColor:'#000',
        opacity:0.7
    },
    mainContainer:{
        position:'absolute',
        paddingLeft:25,
        paddingRight:25,
        width:'100%',
        height:250
    },
    searchContainer:{
        width:'100%',
        height:42,
        backgroundColor:'#fff',
        borderWidth:1,
        borderColor:'#B5B4B4',
        borderRadius:12,
        alignItems:'center',
        flexDirection:'row'
    },
    searchInput:{
        flex:1,
        paddingLeft:10,
        paddingRight:20,
    },
    searchImage:{
        marginLeft:10,
        width:20,
        height:20,
        resizeMode:'contain',
        opacity:0.5
    },
    suggestContainer:{
        width:'100%',
        flex:1,
        backgroundColor:'#fff',
        borderWidth:1,
        borderColor:'#B5B4B4',
        borderRadius:20
    },
    suggestTitleContainer:{
        width:'100%',
        height:42,
        justifyContent:'center',
        paddingLeft:20,
        paddingRight:20
    },
    suggestTitlePadding:{
        width:'100%',
        height:8,
        borderBottomColor:'#B5B4B4',
        borderBottomWidth:1
    },
    suggestTitleText:{
        fontSize:15,
        color:'#767171',
    },
    suggestContentContainer:{
        width:'100%',
        height:30,
        flexDirection:'row',
        alignItems:'center'
    },
    suggestContentText:{
        maxWidth:screenWidth-180,
        fontSize:15,
        color:'#121111',
        paddingLeft:10
    },
    suggestContentType:{
        height:'100%',
        paddingLeft:10,
        justifyContent:'center',
        width:70
    },
    suggestContentTypeText:{
        fontSize:13,
        textAlign:'right',
        color:'#FF6E43',
    }
})