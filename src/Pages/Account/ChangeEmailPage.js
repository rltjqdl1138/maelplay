import React, {Component} from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Image } from 'react-native'

import SimpleHeader from '../components/SimpleHeader'
import networkHandler from '../networkHandler'


export default class ChangeEmailPage extends Component {
    constructor(props){
        super(props)
        if(props.config && props.config.value)
            this.state = {email: props.config.value, notice:''}
        else
            this.state = {email:'a', notice:''}
    }
    handleChange = (field, text) => {
        this.setState({
            [field]: text
        });
    }
    handleComplete = async () =>{
        const {email} = this.state
        const response = await networkHandler.account.changeEmail({email},this.props.token)
        console.warn(response)
        if(!response.success)
            return this.handleChange('notice','이메일 변경에 실패했습니다.')
        this.props.config && this.props.config.handler ? this.props.config.handler() : null
        return this.props.navigator.pop('ChangeEmailPage')
    }
    render(){
        const {navigator} = this.props
        const {handleChange, handleComplete} = this
        const {email, notice} = this.state
        return(
            <View style={styles.container}>

                <SimpleHeader 
                    title="이메일 변경"
                    handler={()=>{navigator.pop('ChangeEmailPage')}}
                    notice={notice}
                    handleComplete={handleComplete}/>

                <ScrollView
                    contentContainerStyle={styles.mainContainer}
                    keyboardShouldPersistTaps='handled'
                    scrollEnabled={false}>
                    
                    <View style={styles.informContainer}>
                        <View style={styles.informTypeContainer}>
                            <Text style={styles.informTypeText}>
                                이메일
                            </Text>
                        </View>
                        <View style={styles.informValueContainer}>
                            <TextInput style={styles.informValueText}
                                numberOfLines={1}
                                value={email}
                                onChangeText={text=>handleChange('email',text)}>
                            </TextInput>
                        </View>
                        <TouchableOpacity style={styles.deleteContainer}
                            onPress={()=>this.setState({email:''})}>
                                <Image style={{resizeMode:'contain', flex:1}}
                                    source={require('../icon/clear.png')} />
                        </TouchableOpacity>
                    </View>
                    
                </ScrollView>

                
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
        borderBottomColor:'#ccc',
        borderBottomWidth:1,
    },
    informValueText:{
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
})