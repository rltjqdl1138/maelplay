import React, {Component} from 'react'
import {View, StyleSheet, Text, TextInput, ScrollView, Button, Picker, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import SimpleHeader from '../components/SimpleHeader'
import deviceCheck from '../deviceCheck'
import networkHandler from '../networkHandler'


const size12 = deviceCheck.getFontSize(12)
const size14 = deviceCheck.getFontSize(14)
const size17 = deviceCheck.getFontSize(17)
export default class ChangePhonePage extends Component {
    constructor(props){
        super(props)
        this.state={
            notice:'',
            isLoaded:false,
            countryCode:'82',
            phone:'',
            phoneCheck:'',
            isPickerOpen:false,
            token:'',
            mobileNotice:''
        }
    }

    componentDidMount() {
        this.getCountryCode()
    }
    async getCountryCode(){
        const result = await networkHandler.info.getCountryCode()
        if(!result.success || !result.list)
            return;
        this.setState((state)=>({
            ...state,
            isLoaded:true,
            countryCodeList:result.list
        }))
    }
    sendMessage = async ()=>{
        const {phone,countryCode}=this.state

        if(phone.length < 10 || phone.length > 11)
            return this.handleChange('notice','올바른 핸드폰 번호를 입력해주세요')
        this.handleChange('isLoaded', false)
        const response = await networkHandler.info.mobileAuth(phone, countryCode, 1)
        return this.setState(state=>({
            ...state,
            notice: response.success? '메세지 전송에 성공했습니다.': '메세지 전송에 실패했습니다',
            isLoaded:true
        }))
    }
    keyCheck = async() =>{
        const {phone, countryCode, phoneCheck} = this.state
        const response = await networkHandler.info.checkMobileAuth(phone, countryCode, phoneCheck)
        console.warn(response)
        if(!response.success || !response.token)
            return this.handleChange('mobileNotice', '인증번호가 올바르지 않습니다.')
        return this.setState(state=>({
            ...state,
            mobileNotice:'인증에 성공하였습니다.',
            token: response.token,
            id: response.token
        }))
    }

    getPickerItem = (_code, name, isIOS) =>{
        if(!_code || !name) return null
        else if(isIOS)
            return ( <Picker.Item key={_code} label={'+'+_code} value={_code} /> )
        
        return ( <Picker.Item key={_code} label={name} value={_code} /> )
    }
    getPicker = ()=>{
        const pickerItems = !this.state.countryCodeList ? null :
            this.state.countryCodeList.map(item =>
                this.getPickerItem(item.code, item.name, deviceCheck.ifIOS)
            )

        if(deviceCheck.ifIOS){
            return(
                <View style={[styles.pickerContainer, {display:this.state.isPickerOpen?'flex':'none'}]}>
                    <Picker style={{width:'100%', height:'100%'}}
                        itemStyle={{fontSize: 13, color:'#121111'}}
                        selectedValue={this.state.countryCode}
                        onValueChange={text=>this.handleChange('countryCode',text)} >
                            {pickerItems}
                    </Picker>
                </View>
            )
        }
        return(
            <Picker style={styles.androidPickerContainer}
                selectedValue={this.state.countryCode}
                onValueChange={text=>this.handleChange('countryCode',text)} >
                    {pickerItems}
            </Picker>        
        )
    }

    handleChange = (field, text) => {
        if(field === this.state.phoneCheck)
            return this.setState({ [field]:text.replace(/[^(0-9)]/gi, "")})
        this.setState({
            [field]: text
        });
    }
    handleComplete = async ()=>{
        const {navigator} = this.props
        const { phone, countryCode, token } = this.state
        if(!token || token === '')
            return this.handleChange('notice', '핸드폰 인증을 먼저 해주세요.')
        this.handleChange('isLoaded', false)
        const body = {mobile:phone, countryCode, token}
        const response = await networkHandler.account.changeMobile(body, this.props.token)
        if(!response.success)
            return this.setState(state=>({
                ...state,
                isLoaded:true,
                notice:'인증에 실패했습니다'
            }))
        this.props.config && this.props.config.handler ? this.props.config.handler() : null
        return navigator.pop('ChangePhonePage')

    }
    render(){
        const {handleChange} = this
        const {navigator} = this.props
        const {mobileNotice, notice} = this.state
        return(
            <View style={styles.container}>

                <SimpleHeader 
                    title="비밀번호 변경"
                    handler={()=>{navigator.pop('ChangePhonePage')}}
                    handleComplete={()=>{this.handleComplete()}}
                    notice={notice}/>

                <ScrollView style={styles.mainContainer}
                    onScrollBeginDrag={()=>{handleChange('isPickerOpen',false)}}
                    scrollEnabled={false}>

                    <View style={styles.PhoneEmail}>
                    <View style={{flexDirection:'row',width:'100%'}} >
                            <TouchableOpacity style={styles.countryCodeBox}
                                onPress={()=>handleChange('isPickerOpen',!this.state.isPickerOpen)}>
                                <View style={styles.countryCodeTextContainer}>
                                    <Text style={styles.countryCodeText} >
                                        {'+'+this.state.countryCode}
                                    </Text>
                                </View>
                                <View style={styles.countryCodeButton}>

                                </View>
                            </TouchableOpacity>
                            <View style={styles.phoneinputBox}>
                                <TextInput style={{flex:1}}
                                    keyboardType="number-pad"
                                    placeholder="휴대전화"
                                    placeholderTextColor='#888'
                                    onChangeText={text=>handleChange('phone',text)}
                                />
                                <TouchableOpacity style={{width:60, justifyContent:'center'}}
                                    onPress={this.sendMessage}>
                                    <Text style={{fontSize:13, color:'#121111'}}>인증받기</Text>
                                </TouchableOpacity>

                            </View>
                        </View>

                        <View style={styles.simplePadding}/>
                        <View style={styles.inputBoxContainer} >
                            <View style={styles.inputBox}>

                                <TextInput style={{flex:1}}
                                    placeholder="인증번호"
                                    keyboardType="number-pad"
                                    placeholderTextColor='#888'
                                    maxLength={6}
                                    onChangeText={text=>handleChange('phoneCheck',text)}
                                />

                                <TouchableOpacity style={{width:60, justifyContent:'center'}}
                                    onPress={this.keyCheck}>
                                    <Text style={{fontSize:13, color:'#121111'}}>인증확인</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.textPadding}>
                            <Text style={styles.okText}>
                                {mobileNotice}
                            </Text>
                        </View>
                        {this.getPicker()}
                        <View style={styles.simplePadding}/>
                    </View>

                </ScrollView>

            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        width:'100%',
        height:'100%',
        backgroundColor: '#fff'
    },

    mainContainer:{
        width:'100%',
        flex:1
    },

    subtitle:{
        fontSize: size17,
        color: '#121111',
        paddingBottom:20
    },

    accountInform:{
        paddingLeft:25,
        paddingRight:25,
        paddingTop:40
    },

    IDPW:{
        paddingLeft:25,
        paddingRight:25,
        paddingTop:40
    },
    PhoneEmail:{
        paddingLeft:25,
        paddingRight:25,
        paddingTop:40

    },
    
    inputBoxContainer:{
        width:'100%',
        flexDirection:'row',
        borderRadius:15,
        borderWidth:1,
        borderColor:'#ddd',
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
    textPadding:{
        width:'100%',
        height:26,
        marginLeft:12,
        justifyContent:'center'
    },
    okText:{
        fontSize:size12,
        color:'#FF6E43'
    },
    errText:{
        fontSize:size12,
        color:'#767171'
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
        backgroundColor:'#ccc',
        borderTopRightRadius:15,
        borderBottomRightRadius:15,
        borderWidth:1,
        borderColor:'#ddd'
    },
    countryCodeButtonImage:{

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
        left:20,
        top:70,
        width:70,
        height:180,
        backgroundColor:'#fff',
        borderWidth:1,
        borderRadius:10,
        borderColor:'#000'
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
        borderColor:'#000'
    },


    enterButtonContainer:{
        height: 80,
        width:'100%',
        alignItems:'center'
    },
    enterButton:{
        width:80,
        height:80,
        backgroundColor:'#0f0'
    },

    bottomPadding:{
        height:300,
        width:'100%'
    }

})

const pickerStyle = StyleSheet.create({
    container:{
        width:50,
        height:250,
        borderColor:'#000',
        borderWidth:1,
        borderRadius:10,
        alignSelf:'center'
    },
    headerContainer:{
        width:'100%',
        flex:1,
        backgroundColor:'#ddd',
        justifyContent:'center',
        alignItems:'flex-end'
    },
    doneButton:{
        width:60,
        height:'80%',
        backgroundColor:'#aaa',
        marginRight:20,
        justifyContent:'center',
        borderColor:'#121212',
        borderWidth:1,
        borderRadius:10
    },
    doneText:{
        textAlign:'center',
        fontSize:size14
    }
})