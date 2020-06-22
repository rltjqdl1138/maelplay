import React, {Component} from 'react'
import {View, StyleSheet, Text, TextInput, ScrollView, Button, Picker, TouchableOpacity, Keyboard, Dimensions, Image} from 'react-native'
import SimpleHeader from '../../Header/SimpleHeader'
import {Account} from '../../NetworkHandler'

export default class SignupPage extends Component {
    constructor(props){
        super(props)
        this.state={
            // TextInput Values
            id:'',
            password:'',
            passwordCheck:'',
            name:'',
            countryCode:'82',
            phone:'',
            phoneCheck:'',

            birthday1:'',
            birthday2:'',
            birthday3:'',

            // Layout Status
            isLoaded:false,
            isMessageSend:false,
            isPickerOpen:false,
            isKeyboardOpen:false,

            // Notice Values
            idNotice:{text:'',ok:false},
            passwordNotice:{text:'',ok:false},
            mobileNotice:{text:'',ok:false},

            //Hidden Values
            countryCodeList:[],
            signupToken:'',
            focus:'',
            inputPositions:{isLoaded:false},
            height:0
        }
    }
    checkID = false
    async getCountryCode(){
        const result = await Account.getCountryCode()
        return result.success && result.list ?
            this.setState((state)=>({
                ...state,
                isLoaded:true,
                countryCodeList:result.list
            })) : this.props.navigator.pop('Signuppage')
            
    }
    componentDidMount() {
        this.getCountryCode()
		this._keyboardWillShowSubscription = Keyboard.addListener('keyboardDidShow', (e) => this._keyboardWillShow(e));
		this._keyboardWillHideSubscription = Keyboard.addListener('keyboardDidHide', (e) => this._keyboardWillHide(e));
	}
	componentWillUnmount() {
		this._keyboardWillShowSubscription.remove();
		this._keyboardWillHideSubscription.remove();
	}
	_keyboardWillShow(e) {
        this.setState(state=>({...state,
            height: e.endCoordinates.height,
            isKeyboardOpen:true
        }));
        this.handleChange('isKeyboardOpen',true)
	}
	_keyboardWillHide(e) {
        this.setState(state=>({...state, height: 0,
        isKeyboardOpen:false}));
    }
    
    getIDNotice = async ()=>{
        const {id} = this.state
        this.checkID = false
        if(!id || id==='')
            return this.handleChange('idNotice',{text:'', ok:false})
        else if(id.length < 8)
            return this.handleChange('idNotice', {text:'ID는 8자리 이상이어야 합니다.', ok:false})
        else if(id.length >16)
            return this.handleChange('idNotice', {text:'ID는 16자리 이하여야 합니다.',ok:false})

        const result = await Account.getCheckID(id)
        if(result && result.success && !result.overlaped){
            this.checkID = true
            return this.handleChange('idNotice', {text:id+'는 사용 가능한 ID입니다.', ok:true})
        }
        return this.handleChange('idNotice',{text: id+'는 이미 사용중인 아이디 입니다.', ok:false})
    }
    getPasswordNotice( ){
        const {password, passwordCheck} = this.state
        const number = password.replace(/[^(0-9)]/gi, "")
        const upper = password.replace(/[^(a-z)]/g, "")
        const lower = password.replace(/[^(A-Z)]/g, "")

        switch(true){
            case password.length === 0:
                return this.handleChange('passwordNotice', {text:'', ok:false})
            case password.length < 8:
                return this.handleChange('passwordNotice', {text:'비밀번호는 8자리 이상이어야 합니다.',ok:false})
            case number.length === 0:
            case upper.length === 0:
            case lower.length === 0:
                return this.handleChange('passwordNotice', {text:'사용할 수 없는 비밀번호입니다.',ok:false})
            case passwordCheck.length === 0:
                return this.handleChange('passwordNotice', {text:'사용가능한 비밀번호 입니다.',ok:true})
            case passwordCheck !== password:
                return this.handleChange('passwordNotice', {text:'입력하신 비밀번호와 확인란의 비밀번호가 다릅니다.', ok:false})
            default:
                return this.handleChange('passwordNotice', {text:'확인되었습니다.', ok:true})
        }
    }
    getPickerItem = (_code, name, isIOS) =>{
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

    handleChange = (field, text) => {
        switch(field){
            case 'id':
                return this.setState({ [field]:text},()=>this.getIDNotice())
            case 'password':
            case 'passwordCheck':
                return this.setState({ [field]:text},()=>this.getPasswordNotice())
            case 'phonecheck':
                return this.setState({ [field]:text.replace(/[^(0-9)]/gi, "").slice(0,6)})
            default:
                return this.setState({ [field]:text })
        }
    }

    sendMessage = async ()=>{
        const {phone,countryCode}=this.state
        if(phone.length < 10)
            return this.handleChange('mobileNotice',{text:'올바른 휴대전화 번호를 입력해주세요', ok:false})
        this.handleChange('isLoaded', false)
        const response = await Account.mobileAuth(phone, countryCode, 0)
        return response.success ?
            this.setState(state=>({
                ...state,
                isMessageSend:true,
                mobileNotice:{text:'메세지가 전송되었습니다. 3분 내로 인증확인을 해주세요.', ok:true}
            })) : alert('fail')
    }

    keyCheck = async()=>{
        const {phone, countryCode, phoneCheck, isMessageSend} = this.state
        if(!isMessageSend)
            return this.handleChange('mobileNotice', {text:'인증받기 버튼을 눌러 메세지를 받아주세요', ok:false})
        else if(phoneCheck.length < 6)
            return this.handleChange('mobileNotice', {text:'인증번호 6자리를 입력해주세요', ok:false})
        const response = await Account.checkMobileAuth(phone, countryCode, phoneCheck)
        return !response.success || !response.token ?
            this.handleChange('mobileNotice', {text:'인증번호가 올바르지 않습니다.', ok:false}) :
            this.setState(state=>({
                ...state,
                mobileNotice:{text:'인증에 성공하였습니다.', ok:true},
                signupToken: response.token
            }))
    }

    completeSignup = async()=>{
        const {id, password, passwordCheck, name, birthday1, birthday2, birthday3, phone, countryCode, signupToken} = this.state
        const {idNotice, passwordNotice, mobileNotice} = this.state
        const birthday = (birthday1 + birthday2 + birthday3)
        switch(true){
            case id.length === 0:
            case password.length === 0:
            case passwordCheck.length === 0:
            case name.length === 0:
            case birthday.length === 0:
                return alert('빈칸')

            case signupToken.length === 0:
                return alert('인증 필요')

            case !idNotice.ok:
                return alert(idNotice.text)
            case !passwordNotice.ok:
                return alert(passwordNotice.text)
            case !mobileNotice.ok:
                return alert(mobileNotice.text)
            

            default:
                const payload = {id, password, mobile:phone, countryCode, name, birthday, token:signupToken}
                const result = await Account.getCheckID(id)
                if(!result || !result.success)
                    return alert('통신 오류')
                else if(result.overlaped)
                    return this.handleChange('idNotice',{text:`${id}는 이미 사용중인 아이디입니다.`})
                
                const response = await Account.registerAccount(payload)
                response.success ? this.props.auth.handleLogin({token: response.data.token, name: response.data.name, platform:'original'}) : null
                return response.success ? this.props.navigator.push('Greetingpage') : alert('실패')
        }
        
    }

    render(){
        const {handleChange} = this
        const {navigator} = this.props
        const {idNotice, passwordNotice, mobileNotice, isMessageSend, isLoaded} = this.state
        const {birthday1, birthday2, birthday3} = this.state
        return(
            <View style={styles.container}>

                <SimpleHeader 
                    title="회원가입"
                    handler={()=>{navigator.pop('SignupPage')}}
                    disableNotice={true}
                    notice=''/>

                <ScrollView style={styles.mainContainer}
                    ref='scrollView'
                    onLayout={()=>{
                        let position = {isLoaded:true}
                        this.refs.idInput.measure((x, y, width, height, pageX, pageY) => {position.id = y })
                        this.refs.passwordInput.measure((x, y, width, height, pageX, pageY) => {position.password = y; position.passwordCheck = y })
                        this.refs.nameInput.measure((x, y, width, height, pageX, pageY) => {position.name = y })
                        this.refs.birthdayInput.measure((x, y, width, height, pageX, pageY) => {position.birthday = y })
                        this.refs.phoneInput.measure((x, y, width, height, pageX, pageY) => {position.phone = y; position.phoneCheck = y })

                        return this.state.inputPositions.isLoaded ? null: handleChange('inputPositions', position)
                    }}

                    onContentSizeChange={(w,h)=>{
                        const {inputPositions, focus} = this.state
                        const scrollResponder = this.refs.scrollView.getScrollResponder();
                        return focus && focus.length > 0 ?
                            scrollResponder.scrollResponderScrollTo({x: 0, y: inputPositions[focus], animated:true}) : null
                    }}

                    onScrollBeginDrag={()=>{handleChange('isPickerOpen',false)}} >
                            
                    <View ref="idInput" style={{height:40}} />
                    <InputContainer
                        title='ID'
                        list={[{ key:'id', name:'ID' }]}
                        handleChange={handleChange}
                        notice={idNotice}
                    />
                    <View ref="passwordInput"/>
                    <InputContainer
                        title='PASSWORD'
                        list={[{key:'password', name:'비밀번호'},
                            {key:'passwordCheck', name:'비밀번호 확인'}]}
                        handleChange={handleChange}
                        notice={passwordNotice}
                        isSecret={true}
                    />

                    <View ref="nameInput"/>
                    <InputContainer
                        title='이름'
                        list={[{key:'name', name:'이름'}]}
                        handleChange={handleChange}
                    />

                    <View ref="birthdayInput"/>
                    <View style={{paddingLeft:25, paddingRight:25}}>
                        <Text style={styles.subtitle}>생년월일</Text>
                        <View style={styles.inputBoxContainer}>
                            <View style={[styles.inputBox,{alignItems:'center', justifyContent:'center'}]}>
                                
                                <TextInput style={{width:60}}
                                    ref="birthday1"
                                    placeholder="YYYY"
                                    placeholderTextColor='#888'
                                    keyboardType="number-pad"
                                    maxLength={4}
                                    onChangeText={text=>{
                                        handleChange('birthday1',text)
                                        parseInt(text) >= 1000 ? this.refs.birthday2.focus() : null
                                    }} />
                                <Text style={{paddingRight:20}}>년</Text>
                                <TextInput style={{width:40}}
                                    ref="birthday2"
                                    placeholder="MM"
                                    placeholderTextColor='#888'
                                    keyboardType="number-pad"
                                    maxLength={2}
                                    onChangeText={text=>{
                                        handleChange('birthday2',text)
                                        if(text.length === 0) 
                                            return this.refs.birthday1.focus()
                                        parseInt(text) >= 3 ? this.refs.birthday3.focus() : null
                                    }} />
                                <Text style={{paddingRight:20}}>월</Text>
                                <TextInput style={{width:40}}
                                    ref="birthday3"
                                    placeholder="DD"
                                    placeholderTextColor='#888'
                                    keyboardType="number-pad"
                                    maxLength={2}
                                    onChangeText={text=>{
                                        handleChange('birthday3',text)
                                        if(text.length === 0) 
                                            return this.refs.birthday2.focus()
                                    }} />
                                <Text style={{paddingRight:20}}>일</Text>
                            </View>
                        </View>
                        <View style={{height:20}}/>
                    </View>
                    
                    <View ref="phoneInput"/>
                    <View style={{paddingLeft:25, paddingRight:25}}>
                        <Text style={styles.subtitle} >PHONE</Text>
                        <View style={{flexDirection:'row',width:'100%'}} >

                            <TouchableOpacity style={styles.countryCodeBox}
                                onPress={()=>handleChange('isPickerOpen',!this.state.isPickerOpen)}>
                                <View style={styles.countryCodeTextContainer}>
                                    <Text style={styles.countryCodeText} >
                                        {'+ '+this.state.countryCode}
                                    </Text>
                                </View>
                                <View style={styles.countryCodeButton}>
                                    <Image style={styles.countryCodeButtonImage}
                                        source={require('../../../assets/icons/countryCode.png')} />
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
                                { isMessageSend || this.state.signupToken ? null:(<TouchableOpacity style={{width:60, justifyContent:'center'}}
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

                                {this.state.signupToken?null:(<TouchableOpacity style={{width:60, justifyContent:'center'}}
                                    onPress={this.keyCheck}>
                                    <Text style={{fontSize:13, color:'#121111'}}>인증확인</Text>
                                </TouchableOpacity>)}
                            </View>
                        </View>

                        <View style={styles.textPadding}>
                            <Text style={mobileNotice.ok?styles.okText:styles.errText}>
                                {mobileNotice.text}
                            </Text>
                        </View>
                        {this.getPicker()}
                        <View style={styles.simplePadding}/>
                        
                    </View>

                    <View style={styles.enterButtonContainer}>
                        <TouchableOpacity style={styles.enterButton}
                            onPress={async()=>{this.completeSignup()}}>
                                <Image style={{width:'100%', height:'100%', resizeMode:'contain'}}
                                    source={require('../../../assets/icons/signupComplete.png')} />
                        </TouchableOpacity>
                    </View>
                <View style={{width:'100%',height:this.state.height}} />
                </ScrollView>
            </View>
        )
    }
}

class InputContainer extends Component {
    render(){
        // key, name
        const { title, list, handleChange, notice, isSecret } = this.props
        const items = list.map( (item, index)=>(
            <View key={item.key}>
                <View style={styles.inputBoxContainer}>
                    <TextInput style={styles.inputBox}
                        onFocus={()=>handleChange('focus',item.key)}
                        placeholder={item.name}
                        placeholderTextColor='#888'
                        secureTextEntry={isSecret}
                        onChangeText={text=> handleChange(item.key, text) }/>
                </View>
                <View style={{height:5}} />
            </View>
        ))

        return(
            <View style={{paddingLeft:25, paddingRight:25}}>
                <Text style={styles.subtitle}>{title}</Text>
                {items}

                {notice?
                    (<Text style={notice.ok?styles.okText:styles.errText}>
                        {notice.text}
                    </Text>) : null}
                <View style={{height:20}}/>
            </View>
        )
    }
}
//secureTextEntry={true}

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

    subContainer:{
        
    },

    subtitle:{
        fontSize: 17,
        color: '#121111',
        paddingBottom:5
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
        left:25,
        top:65,
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
