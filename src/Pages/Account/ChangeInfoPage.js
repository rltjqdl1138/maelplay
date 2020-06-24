import React, {Component} from 'react'
import {View, StyleSheet, Text, TextInput, ScrollView, Picker, TouchableOpacity, Keyboard, Image } from 'react-native'
import SimpleHeader from '../../Header/SimpleHeader'
import {Account} from '../../NetworkHandler'

export default class ChangeInfoPage extends Component {
    constructor(props){
        super(props)
        this.state={
            value:this.props.config.value,
            mobileToken:'',
            isLoaded:false,
            notice:''
        }
    }
    componentDidMount() {
		this._keyboardWillShowSubscription = Keyboard.addListener('keyboardDidShow', (e) => this._keyboardWillShow(e));
		this._keyboardWillHideSubscription = Keyboard.addListener('keyboardDidHide', (e) => this._keyboardWillHide(e));
	}
	componentWillUnmount() {
		this._keyboardWillShowSubscription.remove();
        this._keyboardWillHideSubscription.remove();
        this.props.config.handler ? this.props.config.handler() : null
	}
	_keyboardWillShow=(e) => this.handleChange('isKeyboardOpen',true)
	_keyboardWillHide=(e) => this.handleChange('isKeyboardOpen', false)
    setHandler=(handler) => this.handler = typeof handler === 'function' ? handler : ()=>{}
    handleComplete=async() => {
        const result = await this.handler(this.state.value, this.props.auth.token, this.state.mobileToken)
        result ? this.props.navigator.pop('Changeinfopage') : null
    }
    
    
    handleChange = (field, text) => field === 'phoneCheck' ?
        this.setState({ [field]:text.replace(/[^(0-9)]/gi, "")}) :
        this.setState({ [field]: text })
    
    getMainitem = ()=>{
        const {key, name} = this.props.config
        const {value} = this.state
        switch(key){
            case 'birthday':
                return (<BirthdayItem value={value} name={name}
                    setHandler={this.setHandler}
                    handleNotice={(v)=>this.handleChange('notice',v)}
                    handleUpperChange={(v)=>this.handleChange('value', v)}
                />)
            case 'phone':
                return (<PhoneItem value={value} name={name}
                    setHandler={this.setHandler}
                    handleMobileToken={(v)=>this.handleChange('mobileToken', v)}
                    handleNotice={(v)=>this.handleChange('notice', v)}
                    handleUpperChange={(v)=>this.handleChange('value', v)}
                />)
            case 'password':
                return (<PasswordItem value={value} name={name}
                    setHandler={this.setHandler}
                    handleNotice={(v)=>this.handleChange('notice', v)}
                    handleUpperChange={(v)=>this.handleChange('value', v)}
                />)
            default:
                return (<NormalItem value={value} name={name}
                    setHandler={this.setHandler}
                    handleNotice={(v)=>this.handleChange('notice', v)}
                    handleUpperChange={(v)=>this.handleChange('value', v)}
                />)
        }
    }
    render(){
        const {handleChange, getMainitem} = this
        const {navigator, config} = this.props
        const {notice} = this.state
        //key value name
        return(
            <View style={styles.container}>
                <SimpleHeader 
                    title={`${config.name} 변경`}
                    handler={()=>{navigator.pop('Changeinfopage')}}
                    handleComplete={this.handleComplete}
                    notice={notice}/>
                { getMainitem() }
            </View>
        )
    }
}

class BirthdayItem extends Component{
    constructor(props){
        super(props)
        this.state = {
            year:   this.props.value.slice(0,4),
            month:  this.props.value.slice(4,6),
            day:    this.props.value.slice(6,8)
        }
    }
    componentDidMount(){
        this.props.setHandler(this.handleComplete)
    }
    handleComplete = async (value, token, mtoken)=>{
        const result = await Account.changeInfo('birthday', token, {birthday:value})
        return result.success
    }
    upperChangeHandle = ()=>{
        const {year, month, day} = this.state
        const value = year  + (month.length === 1 ? '0' + month : month)
                            + (day.length === 1 ? '0' + day : day)
        this.props.handleUpperChange(value)
    }
    handleChange = (field, text) => this.setState({ [field]:text}, this.upperChangeHandle)
    handleClear = () => this.setState({year:'', month:'', day:''}, this.upperChangeHandle)
    
    render(){
        const {key, value, name} = this.props
        const {year, month, day} = this.state
        return (
            <ScrollView
                contentContainerStyle={styles.mainContainer}
                keyboardShouldPersistTaps='handled'
                scrollEnabled={false}>
                
                <View style={styles.informContainer}>
                    <View style={styles.informTypeContainer}>
                        <Text style={styles.informTypeText}> {name} </Text>
                    </View>
                    <View style={styles.informValueContainer}>
                        <TextInput style={styles.sepertatedInformValueText}
                            ref="birthday1"
                            placeholder="YYYY"
                            placeholderTextColor='#888'
                            keyboardType="number-pad"
                            maxLength={4}
                            value={year}
                            onChangeText={text=>{
                                this.handleChange('year',text)
                                parseInt(text) >= 1000 ? this.refs.birthday2.focus() : null
                            }} />
                        <Text>년</Text>
                        <TextInput style={styles.sepertatedInformValueText}
                            ref="birthday2"
                            placeholder="MM"
                            placeholderTextColor='#888'
                            keyboardType="number-pad"
                            maxLength={2}
                            value={month}
                            onChangeText={text=>{
                                this.handleChange('month',text)
                                if(text.length === 0) 
                                    return this.refs.birthday1.focus()
                                parseInt(text) >= 3 ? this.refs.birthday3.focus() : null
                            }} />
                        <Text>월</Text>
                        <TextInput style={styles.sepertatedInformValueText}
                            ref="birthday3"
                            placeholder="DD"
                            placeholderTextColor='#888'
                            keyboardType="number-pad"
                            maxLength={2}
                            value={day}
                            onChangeText={text=>{
                                this.handleChange('day',text)
                                if(text.length === 0) 
                                    return this.refs.birthday2.focus()
                            }} />
                        <Text>일</Text>
                    </View>
                    <TouchableOpacity style={styles.deleteContainer} onPress={this.handleClear}>
                        <Image style={{resizeMode:'contain', flex:1}}
                            source={require('../../../assets/icons/clear.png')} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}


class PasswordItem extends Component{
    constructor(props){
        super(props)
        this.state = {
            oldPassword:'',
            passwordCheck:''
        }
    }
    componentDidMount(){
        this.props.setHandler(this.handleComplete)
    }
    handleComplete = async (value, token, mtoken)=>{
        const {oldPassword} = this.state
        const PasswordChecking = this.getPasswordNotice()
        if(!PasswordChecking)
            return false
        const result = await Account.changeInfo('password', token, {oldPassword, password:value})
        if(!result.success)
            this.props.handleNotice(result.isnotCorrect ? '기존 비밀번호가 올바르지 않습니다.' : '잠시 후 다시 시도해주세요')
        console.warn(result)
        return result.success
    }
    handleChange = (field, text) => this.setState({ [field]:text })
    
    getPasswordNotice( ){
        const password = this.props.value
        const {passwordCheck, oldPassword} = this.state
        const number = password.replace(/[^(0-9)]/gi, "")
        const upper = password.replace(/[^(a-z)]/g, "")
        const lower = password.replace(/[^(A-Z)]/g, "")

        switch(true){
            case oldPassword.length === 0:
                this.props.handleNotice('기존 비밀번호를 입력해주세요')
                return false
            case oldPassword.length < 8:
            case password.length < 8:
                this.props.handleNotice('비밀번호는 8자리 이상이어야 합니다.')
                return false
            case number.length === 0:
            case upper.length === 0:
            case lower.length === 0:
                this.props.handleNotice('사용할 수 없는 비밀번호입니다.')
                return false
            case passwordCheck.length === 0:
                this.props.handleNotice('비밀번호 확인란을 입력해주세요')
                return false
            case passwordCheck !== password:
                this.props.handleNotice('입력하신 비밀번호와 확인란의 비밀번호가 다릅니다.')
                return false
            default:
                return true
        }
    }
    render(){
        const {key, value, name, handleUpperChange} = this.props
        const {oldPassword, passwordCheck} = this.state
        return (
            <ScrollView
                contentContainerStyle={styles.mainContainer}
                keyboardShouldPersistTaps='handled'
                scrollEnabled={false}>
                
                <View style={styles.informContainer}>
                    <View style={styles.informTypeContainer}>
                        <Text style={[styles.informTypeText, {fontSize:13}]}>
                            기존 비밀번호
                        </Text>
                    </View>
                    <View style={styles.informValueContainer}>
                        <TextInput style={styles.informValueText}
                            onChangeText={text=>this.handleChange('oldPassword',text)}
                            numberOfLines={1}
                            secureTextEntry={true}
                            value={oldPassword}>
                        </TextInput>
                    </View>
                </View>

                <View style={styles.informContainer}>
                    <View style={styles.informTypeContainer}>
                        <Text style={[styles.informTypeText, {fontSize:13}]}>
                            새 비밀번호
                        </Text>
                    </View>
                    <View style={styles.informValueContainer}>
                        <TextInput style={styles.informValueText}
                            onChangeText={text=>handleUpperChange(text)}
                            numberOfLines={1}
                            secureTextEntry={true}
                            value={value}>
                        </TextInput>
                    </View>
                </View>

                <View style={styles.informContainer}>
                    <View style={styles.informTypeContainer}>
                        <Text style={[styles.informTypeText, {fontSize:13}]}>
                            비밀번호 확인
                        </Text>
                    </View>
                    <View style={styles.informValueContainer}>
                        <TextInput style={styles.informValueText}
                            onChangeText={text=>this.handleChange('passwordCheck',text)}
                            numberOfLines={1}
                            secureTextEntry={true}
                            value={passwordCheck}>
                        </TextInput>
                    </View>
                </View>
                <Text>{value}</Text>
            </ScrollView>
        )
    }
}

class NormalItem extends Component{
    render(){
        const {key, value, name, handleChange} = this.props
        return (
            <ScrollView
                contentContainerStyle={styles.mainContainer}
                keyboardShouldPersistTaps='handled'
                scrollEnabled={false}>
                
                <View style={styles.informContainer}>
                    <View style={styles.informTypeContainer}>
                        <Text style={styles.informTypeText}>
                            {name}
                        </Text>
                    </View>
                    <View style={styles.informValueContainer}>
                        <TextInput style={styles.informValueText}
                            onChangeText={text=>handleChange(text)}
                            numberOfLines={1}
                            value={value}>
                        </TextInput>
                    </View>
                    <TouchableOpacity style={styles.deleteContainer}
                        onPress={()=>handleChange('')}>
                        <Image style={{resizeMode:'contain', flex:1}}
                            source={require('../../../assets/icons/clear.png')} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    mainContainer:{
        width:'100%',
        flex:1,
        paddingRight:45,
        paddingLeft:45
    },
    informContainer:{
        width:'100%',
        height:'7%',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    informTypeContainer:{
        flex:1,
        height:'100%',
        justifyContent:'center'
    },
    informTypeText:{
        fontSize:16,
        color:'#121111'
    },
    informValueContainer:{
        flex:3,
        height:'80%',
        justifyContent:'center',
        alignItems:'center',
        borderBottomColor:'#ccc',
        borderBottomWidth:1,
        flexDirection:'row'
    },
    informValueText:{
        flex:1,
        fontSize:16,
        color:'#121111'
    },
    sepertatedInformValueText:{
        flex:1,
        textAlign:'center',
        fontSize:16,
        color:'#121111'
    },
    deleteContainer:{
        width:50,
        height:'80%',
        justifyContent:'center',
        alignItems:'center',
        borderBottomColor:'#ccc',
        borderBottomWidth:1,
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
    textPadding:{
        width:'100%',
        height:26,
        marginLeft:12,
        justifyContent:'center'
    },

    okText:{
        fontSize:12,
        color:'#96e255'
    },
    errText:{
        fontSize:12,
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
        left:0,
        top:40,
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


    enterButtonContainer:{
        height: 80,
        width:'100%',
        alignItems:'center'
    },
    enterButton:{
        width:200,
        height:'100%',
    },

    bottomPadding:{
        height:300,
        width:'100%'
    }

})


class PhoneItem extends Component{
    constructor(props){
        super(props)
        this.state={
            isLoaded:false,
            countryCode:'82',
            phoneCheck:'',
            isPickerOpen:false,
        }
    }
    handleChange = (field, text) => this.setState({ [field]:text} )
    componentDidMount(){
        this.getCountryCode()
        this.props.setHandler(this.handleComplete)
    }
    handleComplete = async (value, token, mtoken)=>{
        const result = await Account.changeInfo('mobile', token,
            {mobile:value, countryCode:this.state.countryCode ,mobileToken:mtoken})
        if(result.overlaped)
            this.props.handleNotice('이미 등록된 휴대전화 번호입니다.')
        return result.success
    }
    getCountryCode = async()=>{
        const result = await Account.getCountryCode()
        return result.success && result.list ?
            this.setState((state)=>({
                ...state,
                isLoaded:true,
                countryCodeList:result.list
            })) : this.props.navigator.pop('Changeinfopage')       
    }
    getPickerItem = (_code, name, isIOS) => {
        if(!_code || !name) return null
        return isIOS ?
            // * IOS *
            ( <Picker.Item key={_code} label={'+ '+_code} value={_code} /> ) :
            // * Android *
            ( <Picker.Item key={_code} label={name} value={_code} /> )
    }

    getPicker = ()=>{
        const pickerItems = !this.state.countryCodeList ? null :
            this.state.countryCodeList.map(item => this.getPickerItem(item.code, item.name, true))

        return true || IOS ?
            // * IOS *
            (<View style={[styles.pickerContainer, {display:this.state.isPickerOpen?'flex':'none'}]}>
                <Picker style={{width:'100%', height:'100%'}}
                    itemStyle={{fontSize: 13, color:'#121111'}}
                    selectedValue={this.state.countryCode}
                    onValueChange={text=>this.handleChange('countryCode',text)} >
                        {pickerItems}
                </Picker>
            </View>) :
            // * Android *
            (<Picker style={styles.androidPickerContainer}
                selectedValue={this.state.countryCode}
                onValueChange={text=>this.handleChange('countryCode',text)} >
                    {pickerItems}
            </Picker>)
    }
    sendMessage = async ()=>{
        const {countryCode}=this.state
        if(this.props.value.length < 10)
            return this.props.handleNotice('올바른 휴대전화 번호를 입력해주세요.')

        const response = await Account.mobileAuth(this.props.value, countryCode, 0)
        if(response.success){
            this.handleChange('isMessageSend',true)
            return this.props.handleNotice('메세지가 전송되었습니다. 3분 내로 인증확인을 해주세요.')
        }
    }

    keyCheck = async()=>{
        const {countryCode, phoneCheck, isMessageSend} = this.state
        if(!isMessageSend)
            return this.props.handleNotice('인증받기 버튼을 눌러 메세지를 받아주세요') 
        else if(phoneCheck.length < 6)
            return this.props.handleNotice('인증번호 6자리를 입력해주세요') 
        const response = await Account.checkMobileAuth(this.props.value, countryCode, phoneCheck)
        
        if (!response.success || !response.token)
            return this.props.handleNotice('인증번호를 다시 확인해주세요')
        this.props.handleNotice('인증 완료되었습니다.')
        return this.props.handleMobileToken(response.token)
            
    }
    render(){
        const {handleUpperChange, value} = this.props
        return (
            <ScrollView style={styles.mainContainer}
                onScrollBeginDrag={()=>{this.handleChange('isPickerOpen',false)}}
                scrollEnabled={false}>

                <View style={{flexDirection:'row',width:'100%'}} >
                    <TouchableOpacity style={styles.countryCodeBox}
                        onPress={()=>this.handleChange('isPickerOpen',!this.state.isPickerOpen)}>
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
                            onChangeText={text=>handleUpperChange(text)}
                            value={value}
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
                            value={this.state.phoneCheck}
                            onChangeText={text=>this.handleChange('phoneCheck',text)}
                        />

                        <TouchableOpacity style={{width:60, justifyContent:'center'}}
                            onPress={this.keyCheck}>
                            <Text style={{fontSize:13, color:'#121111'}}>인증확인</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {this.getPicker()}
                <View style={styles.simplePadding}/>

            </ScrollView>
        )
    }
}


