import React, {Component} from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Keyboard, Image, Picker } from 'react-native'

import SimpleHeader from '../components/SimpleHeader'
import networkHandler from '../networkHandler'
import deviceCheck from '../deviceCheck'

export default class FindIDContainer extends Component {
    constructor(props){
        super(props)
        this.state = {
            name:'',
            phone:'',
            phoneCheck:'',
            countryCode:'82',
            notice:'',

            isLoaded:false,
            isMessageSend:false,
            isPickerOpen:false,

            countryCodeList:[],
            signupToken:''
        }
    }
    componentDidMount(){
        this.getCountryCode()
    }

    async getCountryCode(){
        const result = await networkHandler.info.getCountryCode()
        if(!result.success || !result.list)
            return navigator.pop('FindIDPage')
        this.setState((state)=>({
            ...state,
            isLoaded:true,
            countryCodeList:result.list
        }))    
    }
    handleChange = (field, text) => {
        this.setState({
            [field]: text
        });
    }

    sendMessage = async ()=>{
        const {phone,countryCode}=this.state
        if(phone.length < 10)
            return this.handleChange('notice','올바른 휴대전화 번호를 입력해주세요')
        this.handleChange('isLoaded', false)
        const response = await networkHandler.info.mobileAuth(phone, countryCode, 0)
        if(response.success)
            return this.setState(state=>({
                ...state,
                isMessageSend:true,
                notice:'메세지가 전송되었습니다. 3분 내로 인증확인을 해주세요.'
            }))
        alert('fail')
    }
    keyCheck = async() =>{
        const {phone, countryCode, phoneCheck, isMessageSend} = this.state
        if(!isMessageSend)
            return this.handleChange('notice','인증받기 버튼을 눌러 메세지를 받아주세요')
        else if(phoneCheck.length < 6)
            return this.handleChange('notice','인증번호 6자리를 입력해주세요')
        const response = await networkHandler.info.checkMobileAuth(phone, countryCode, phoneCheck)
        console.warn(response)
        if(!response.success || !response.token)
            return this.handleChange('notice', '인증번호가 올바르지 않습니다.')
        return this.setState(state=>({
            ...state,
            notice:'인증에 성공하였습니다.',
            signupToken: response.token
        }))
    }

    handleComplete = ()=>{
        const {signupToken, name, navigator} = this.state
        const {handleChange} = this
        switch(true){
            case name ==='':
                return handleChange('notice', '이름을 입력해주세요')

            case signupToken === '':
                return handleChange('notice', '인증을 먼저 완료해주세요')

            default:
                handleChange('notice', '')
                navigator.push('FindPasswordPage',{token:signupToken})
        }
    }

    getPickerItem = (_code, name, isIOS) =>{
        if(!_code || !name) return null
        else if(isIOS)
            return ( <Picker.Item key={_code} label={'+ '+_code} value={_code} /> )
        return ( <Picker.Item key={_code} label={name} value={_code} /> )
    }
    getPicker = ()=>{
        const pickerItems = !this.state.countryCodeList ? null :
            this.state.countryCodeList.map(item =>
                this.getPickerItem(item.code, item.name, deviceCheck.ifIOS)
            )

        return deviceCheck.ifIOS ? (
                <View style={[styles.pickerContainer, {display:this.state.isPickerOpen?'flex':'none'}]}>
                    <Picker style={{width:'100%', height:'100%'}}
                        itemStyle={{fontSize: 13, color:'#121111'}}
                        selectedValue={this.state.countryCode}
                        onValueChange={text=>this.handleChange('countryCode',text)} >
                            {pickerItems}
                    </Picker>
                </View>) :
                (<Picker style={styles.androidPickerContainer}
                    selectedValue={this.state.countryCode}
                    onValueChange={text=>this.handleChange('countryCode',text)} >
                        {pickerItems}
                </Picker>)
    }
    render(){
        const {navigator} = this.props
        const {handleChange, handleComplete} = this
        const {notice, countryCode, signupToken, isPickerOpen, isMessageSend, isLoaded} = this.state
        return(
            <View style={styles.container}>
                <SimpleHeader 
                    title="아이디 찾기"
                    handler={()=>{navigator.pop('FindIDPage')}}
                    handleComplete={{title:'다음', handler:()=>handleComplete()}}
                    notice={notice} />

                <View style={styles.mainContainer}>
                    <View style={styles.inputBoxContainer}>
                        <TextInput style={styles.inputBox}
                            placeholder="이름"
                            placeholderTextColor='#888'
                            onChangeText={text=>handleChange('name',text)} />
                    </View>
                    <View style={styles.simplePadding} />
                    <View style={{flexDirection:'row',width:'100%'}} >
                        <TouchableOpacity style={styles.countryCodeBox}
                            onPress={()=>handleChange('isPickerOpen',!isPickerOpen)}>
                            <View style={styles.countryCodeTextContainer}>
                                <Text style={styles.countryCodeText} >
                                    {'+ '+countryCode}
                                </Text>
                            </View>
                            <View style={styles.countryCodeButton}>
                                <Image style={styles.countryCodeButtonImage}
                                    source={require('../icon/countryCode.png')} />
                            </View>
                        </TouchableOpacity>

                        <View style={styles.phoneinputBox}>
                            <TextInput style={{flex:1, color: isMessageSend?'#767171':'#121111'}}
                                keyboardType="number-pad"
                                placeholder="휴대전화"
                                placeholderTextColor='#888'
                                editable={!isMessageSend}
                                onChangeText={text=>handleChange('phone',text)}
                                onFocus={()=>{handleChange('focus','phone')}}
                            />
                            { isMessageSend || signupToken ? null:(<TouchableOpacity style={{width:60, justifyContent:'center'}}
                                onPress={this.sendMessage}
                                disabled={!isLoaded}>
                                <Text style={{fontSize:13, color:'#121111'}}>인증받기</Text>
                            </TouchableOpacity>)}

                        </View>
                        </View>

                        <View style={styles.simplePadding}/>
                        <View style={styles.inputBoxContainer} >
                            <View style={styles.inputBox}>

                                <TextInput style={{flex:1}}
                                    placeholder="인증번호"
                                    keyboardType="number-pad"
                                    placeholderTextColor='#888'
                                    onChangeText={text=>handleChange('phoneCheck',text)}
                                    onFocus={()=>{handleChange('focus','phoneCheck')}}
                                />

                                {signupToken?null:(<TouchableOpacity style={{width:60, justifyContent:'center'}}
                                    onPress={this.keyCheck}>
                                    <Text style={{fontSize:13, color:'#121111'}}>인증확인</Text>
                                </TouchableOpacity>)}
                            </View>
                        </View>

                        {this.getPicker()}
                        <View style={styles.simplePadding}/>
                        
                    </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        height:'100%',
        backgroundColor:'#fff'
    },

    mainContainer:{
        width:'100%',
        height:100,
        padding:25
    },

    inputBoxContainer:{
        width:'100%',
        flexDirection:'row',
        borderRadius:15,
        borderWidth:1,
        borderColor:'#ddd'
    },
    inputBox:{
        width: '100%',
        height: 42,
        paddingLeft:20,
        flexDirection:'row'
    },
    simplePadding:{
        width:'100%',
        height:15
    },


    countryCodeBox:{
        width:80,
        height: 42,
        paddingLeft:10,

        borderRadius:15,
        borderWidth:1,
        borderColor:'#ddd',
        flexDirection:'row'
    },
    countryCodeTextContainer:{
        flex:1,
        justifyContent:'center'
    },
    countryCodeText:{
        textAlign:'center'
    },
    countryCodeButton:{
        width:20,
        height:'100%',
        justifyContent:'center',
        alignItems:'center'
    },
    countryCodeButtonImage:{
        width:'50%',
        resizeMode:'contain'
    },
    phoneinputBox:{
        flex:1,
        height: 42,
        marginLeft:10,
        paddingLeft:20,
        borderRadius:15,
        borderWidth:1,
        borderColor:'#ddd',
        flexDirection:'row'
    },

    pickerContainer:{
        position:'absolute',
        left:25,
        top:110,
        width:80,
        height:200,
        backgroundColor:'#fff',
        borderWidth:1,
        borderRadius:10,
        borderColor:'#ddd'
    },
    androidPickerContainer:{
        position:'absolute',
        left:34,
        top:143,
        width:52,
        height:40,
        backgroundColor:'#fff',
        borderWidth:1,
        borderRadius:15,
        borderColor:'#ddd'
    },


})

