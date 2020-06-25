import React, {Component} from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Keyboard, Image, Picker, ScrollView } from 'react-native'
import SimpleHeader from '../../Header/SimpleHeader'
import {Account} from '../../NetworkHandler'

exports.FindIDPage = class FindIDPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            name:'',
            birthday1:'',
            birthday2:'',
            birthday3:'',

            phone:'',
            phoneCheck:'',
            countryCode:'82',
            notice:'',
            mobileNotice: {text:'이름과 생년월일을 먼저 입력해주세요', ok:false},

            preChecked:false,
            isLoaded:false,
            isMessageSend:false,
            isPickerOpen:false,

            countryCodeList:[],
            mobileToken:''
        }
    }
    componentDidMount(){
        this.getCountryCode()
    }
    handleChange = (field, text, cb) => this.setState({[field]: text}, cb)
    async getCountryCode(){
        const result = await Account.getCountryCode()
        return result.success && result.list ?
            this.setState((state)=>({
                ...state,
                isLoaded:true,
                countryCodeList:result.list
            })) : this.props.navigator.pop('Findidpage')
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
                mobileToken: response.token
            }))
    }
    checkForgetid = async()=>{
        const {name, birthday1, birthday2, birthday3} = this.state
        const birthday = birthday1 +
            (birthday2.length === 1 ? '0'+birthday2 : birthday2) +
            (birthday3.length === 1 ? '0'+birthday3 : birthday3)
        if(birthday.length !== 8) return;

        const response = await Account.checkForgetID(name, birthday)
        if(response.success && response.length === 0)
            this.handleChange('notice', '해당 내용의 회원 정보가 없습니다')
        else{
            this.handleChange('mobileNotice', {text:'',ok:true})
            this.handleChange('notice','')
            this.handleChange('preChecked', true)
        }
    }

    handleComplete = async ()=>{
        const {name, phone, phoneCheck, birthday1, birthday2, birthday3, mobileToken, preChecked} = this.state
        const {handleChange} = this
        const birthday = birthday1 +
            (birthday2.length === 1 ? '0' + birthday2 : birthday2) +
            (birthday3.length === 1 ? '0' + birthday3 : birthday3)

        switch(true){
            case name.length === 0:
                return handleChange('notice', '이름을 입력해주세요')
            case birthday.length < 8:
                return handleChange('notice', '생년월일을 입력해주세요')
            case !preChecked:
                handleChange('notice', '')
                return handleChange('mobileNotice', {text:'해당 내용의 회원정보가 없습니다.', ok:true})

            case phone.length === 0:
            case phoneCheck.length < 6:
            case mobileToken.length === 0:
                return handleChange('notice', '인증을 먼저 완료해주세요')
        }

        const response = await Account.getForgetID({name, birthday, mobileToken})
        switch(true){
            case !response.success:
                return handleChange('notice', '잠시 후 다시 시도해주세요.')
            case !response.id:
                handleChange('notice', '해당 내용의 회원 정보가 없습니다.')
                return handleChange('mobileNotice', {text:'혹시 소셜 아이디로 회원가입 하지 않았나요?', ok:true})
        }
        return this.props.navigator.push('Resetpasswordpage', {id:response.id, name, mobileToken})
    }

    render(){
        const {navigator} = this.props
        const {handleChange, handleComplete} = this
        const {notice, name, birthday1, birthday2, birthday3, isMessageSend, isLoaded, preChecked, mobileNotice} = this.state
        return(
            <View style={styles.container}>
                <SimpleHeader 
                    title="아이디 찾기"
                    handler={()=>{navigator.pop('Findidage')}}
                    handleComplete={{title:'다음', handler:()=>handleComplete()}}
                    notice={notice} />

                <ScrollView style={styles.mainContainer}>
                    <Text style={styles.subtitle}>이름</Text>
                    <View style={styles.inputBoxContainer} >
                        <View style={styles.inputBox}>
                            <TextInput style={{flex:1}}
                                placeholder="이름"
                                placeholderTextColor='#888'
                                value={name}
                                onChangeText={text=>handleChange('name',text)}
                            />
                        </View>
                    </View>

                    <View style={styles.simplePadding}/>
                    <Text style={styles.subtitle}>생년월일</Text>
                    <View style={styles.inputBoxContainer}>
                        <View style={[styles.inputBox,{alignItems:'center', justifyContent:'center'}]}>
                            <TextInput style={{width:60}}
                                ref="birthday1"
                                placeholder="YYYY"
                                placeholderTextColor='#888'
                                keyboardType="number-pad"
                                maxLength={4}
                                value={birthday1}
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
                                value={birthday2}
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
                                value={birthday3}
                                onChangeText={text=>{
                                    handleChange('birthday3',text, ()=>{this.checkForgetid()})
                                    if(text.length === 0)
                                        return this.refs.birthday2.focus()
                                }} />
                            <Text style={{paddingRight:20}}>일</Text>
                        </View>
                    </View>
                    <View style={styles.simplePadding}/>
                    <Text style={styles.subtitle}>휴대전화</Text>
                    <View style={[{width:'100%', flexDirection:'row'}]} >
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
                                editable={!isMessageSend && preChecked}
                                onChangeText={text=>handleChange('phone',text)}
                            />
                            { isMessageSend || this.state.mobileToken ? null:(<TouchableOpacity style={{width:60, justifyContent:'center'}}
                                onPress={this.sendMessage}
                                disabled={!isLoaded || !preChecked}>
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
                                editable={preChecked}
                                onChangeText={text=>handleChange('phoneCheck',text)}
                            />

                            {this.state.mobileToken?null:(<TouchableOpacity style={{width:60, justifyContent:'center'}}
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

                </ScrollView>
            </View>
        )
    }
}

exports.FindPasswordPage = class FindPasswordPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            id:'',

            phone:'',
            phoneCheck:'',
            countryCode:'82',
            notice:'',
            mobileNotice: {text:'아이디를 먼저 입력해주세요', ok:false},

            preChecked:false,
            isLoaded:false,
            isMessageSend:false,
            isPickerOpen:false,

            countryCodeList:[],
            mobileToken:''
        }
    }
    componentDidMount(){
        this.getCountryCode()
    }
    handleChange = (field, text, cb) => this.setState({[field]: text}, cb)
    async getCountryCode(){
        const result = await Account.getCountryCode()
        return result.success && result.list ?
            this.setState((state)=>({
                ...state,
                isLoaded:true,
                countryCodeList:result.list
            })) : this.props.navigator.pop('Findidpage')
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
                mobileToken: response.token
            }))
    }
    checkForgetpassword = async()=>{
        const {id} = this.state
        if(id.length < 8) return;
        const response = await Account.getCheckID(id)

        if(response && response.success && !response.overlaped)
            return this.handleChange('notice', id+'는 가입되지 않은 아이디입니다.')
        this.handleChange('notice','')
        this.handleChange('mobileNotice', {text:'', ok:true})
        this.handleChange('preChecked', true)
    }

    handleComplete = async ()=>{
        const {id, phone, phoneCheck, mobileToken, preChecked} = this.state
        const {handleChange} = this
        
        switch(true){
            case id.length < 8:
                return handleChange('notice', '이름을 입력해주세요')
            case !preChecked:
                return handleChange('mobileNotice', {text:'올바른 아이디를 입력해주세요.', ok:false})

            case phone.length === 0:
            case phoneCheck.length < 6:
            case mobileToken.length === 0:
                return handleChange('notice', '인증을 먼저 완료해주세요')
        }
        const response = await Account.getForgetPassword({id, mobileToken})
        switch(true){
            case !response.success:
                return handleChange('notice', '잠시 후 다시 시도해주세요.')
            case !response.id:
                handleChange('notice', '해당 내용의 회원 정보가 없습니다.')
                return handleChange('mobileNotice', {text:'혹시 소셜 아이디로 회원가입 하지 않았나요?', ok:true})
        }
        return this.props.navigator.push('Resetpasswordpage', {id:response.id, mobileToken})
    }

    render(){
        const {navigator} = this.props
        const {handleChange, handleComplete} = this
        const {notice, id, isMessageSend, isLoaded, preChecked, mobileNotice} = this.state
        return(
            <View style={styles.container}>
                <SimpleHeader 
                    title="비밀번호 찾기"
                    handler={()=>{navigator.pop('Findidage')}}
                    handleComplete={{title:'다음', handler:()=>handleComplete()}}
                    notice={notice} />

                <ScrollView style={styles.mainContainer}>
                    <Text style={styles.subtitle}>아이디</Text>
                    <View style={styles.inputBoxContainer} >
                        <View style={styles.inputBox}>
                            <TextInput style={{flex:1}}
                                placeholder="ID"
                                placeholderTextColor='#888'
                                value={id}
                                onChangeText={text=>handleChange('id',text, this.checkForgetpassword)}
                            />
                        </View>
                    </View>

                    <View style={styles.simplePadding}/>
                    <Text style={styles.subtitle}>휴대전화</Text>
                    <View style={[{width:'100%', flexDirection:'row'}]} >
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
                                editable={!isMessageSend && preChecked}
                                onChangeText={text=>handleChange('phone',text)}
                            />
                            { isMessageSend || this.state.mobileToken ? null:(<TouchableOpacity style={{width:60, justifyContent:'center'}}
                                onPress={this.sendMessage}
                                disabled={!isLoaded || !preChecked}>
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
                                editable={preChecked}
                                onChangeText={text=>handleChange('phoneCheck',text)}
                            />

                            {this.state.mobileToken?null:(<TouchableOpacity style={{width:60, justifyContent:'center'}}
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

                </ScrollView>
            </View>
        )
    }
}

exports.ResetPasswordPage = class ResetPasswordPage extends Component{
    constructor(props){
        super(props)
        this.state = {
            mobileToken : '',
            id:'',
            password:'',
            passwordCheck:'',
            notice:'',
            
            isFindID:true,
            isOnIDNotice:true
        }
    }
    componentDidMount(){
        this.getInfoFromProps()
    }

    handleChange = (field, text, cb) => this.setState({[field]: text}, cb)
    getInfoFromProps = ()=>{
        const {config, navigator} = this.props
        return (!config || !navigator || !config.mobileToken || !config.id)?
            navigator.pop('Resetpasswordpage') :
            this.setState(state=>({
                ...state,
                mobileToken: config.mobileToken,
                id: config.id,
                isFindID : config.name ? true : false,
                isOnIDNotice : config.name ? true : false,
            }))
    }
    IDNotice = ()=>{
        return (
            <View style={{flex:1}}>
                <View style={{ flex:1, justifyContent:'center'}}>
                    <Text style={{fontSize:20, textAlign:'center'}}>회원님의 아이디는</Text>
                    <Text style={{fontSize:20, textAlign:'center'}}>{this.state.id}</Text>
                    <Text style={{fontSize:20, textAlign:'center'}}>입니다.</Text>
                </View>
                <View style={{ flex:1, paddingLeft:25 }}>
                    <TouchableOpacity onPress={()=>this.props.navigator.pop('Findidpage')}>
                        <Text>로그인 하기</Text>
                    </TouchableOpacity>
                    <View style={styles.simplePadding} />
                    <TouchableOpacity onPress={()=>this.handleChange('isOnIDNotice',false)}>
                        <Text>비밀번호 변경하기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    handleComplete = async()=>{
        const {id, password, passwordCheck, mobileToken, isOnIDNotice, isFindID} = this.state
        if(isOnIDNotice)
            return this.props.navigator.pop('Findidpage')
    
        const number = password.replace(/[^(0-9)]/gi, "")
        const upper = password.replace(/[^(a-z)]/g, "")
        const lower = password.replace(/[^(A-Z)]/g, "")
    
        switch(true){
            case password.length < 8:
                return this.handleChange('notice', '비밀번호는 8자리 이상이어야 합니다.')
            case number.length === 0:
            case upper.length === 0:
            case lower.length === 0:
                return this.handleChange('notice', '사용할 수 없는 비밀번호입니다.')
            case passwordCheck !== password:
                return this.handleChange('notice', '입력하신 비밀번호와 확인란의 비밀번호가 다릅니다.')
        }
        const response = await Account.resetPassword({id, password, mobileToken})
        
        return response.success ?
            this.props.navigator.pop(isFindID ? 'Findidpage':'Findpasswordpage') :
            this.handleChange('notice', '사용할 수 없는 비밀번호입니다.')
    }
    render(){
        const {password, passwordCheck, notice, isFindID, isOnIDNotice} = this.state
        return (
            <View style={styles.container}>
                <SimpleHeader 
                    title="비밀번호 변경"
                    handler={()=>{this.props.navigator.pop(isFindID ? 'Findidpage':'Findpasswordpage')}}
                    handleComplete={{title:'완료', handler:()=>this.handleComplete()}}
                    notice={notice} />

                {isOnIDNotice ? this.IDNotice() : (
                <ScrollView style={styles.mainContainer}>

                    <View style={styles.inputBoxContainer} >
                        <View style={styles.inputBox}>
                            <TextInput style={{flex:1}}
                                onChangeText={text=>this.handleChange('password',text)}
                                placeholder="새 비밀번호"
                                placeholderTextColor='#888'
                                numberOfLines={1}
                                secureTextEntry={true}
                                value={password}>
                            </TextInput>
                        </View>
                    </View>

                    <View style={styles.simplePadding}/>

                    <View style={styles.inputBoxContainer} >
                        <View style={styles.inputBox}>
                            <TextInput style={{flex:1}}
                                onChangeText={text=>this.handleChange('passwordCheck',text)}
                                placeholder="비밀번호 확인"
                                placeholderTextColor='#888'
                                numberOfLines={1}
                                secureTextEntry={true}
                                value={passwordCheck}>
                            </TextInput>
                        </View>
                    </View>

                </ScrollView>)}
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

    subtitle:{
        fontSize: 17,
        color: '#121111',
        paddingBottom:5
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
        top:205,
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

