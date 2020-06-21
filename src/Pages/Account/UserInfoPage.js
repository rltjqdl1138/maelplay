import React, {Component} from 'react'
import { StyleSheet, View, Text, TouchableOpacity }from 'react-native'

import SimpleHeader from '../../Header/SimpleHeader'
import {Account} from '../../NetworkHandler'

export default class UserInformationPage extends Component{
    constructor(props){
        super(props)
        this.state = {
            name:'',
            birthday:'',
            phone:'',
            isLoaded:false
        }
    }
    componentDidMount(){
        this.getUserinfo()
    }
    getUserinfo = async ()=>{
        const response = await Account.getUserinfo(this.props.auth.token)
        return !response.success ? this.props.navigator.pop('UserInfopage') :
            this.setState({
                name: response.data.name,
                birthday: response.data.birthday,
                phone: response.data.mobile,
                isLoaded:true
            })
    }

    render(){
        const {navigator} = this.props
        const {name, birthday, phone, isLoaded} = this.state
        const _infoList = [
            {key:'성명', value:name, nextPage:null},
            {key:'생년월일', value:birthday, nextPage:'ChangeBirthdaypage'},
            {key:'전화번호', value:phone, nextPage:'ChangePhonepage'}
        ]

        const infoList = _infoList.map((item,index) =>
            ( <InfoItem key={String(index)} payload={item} navigator={navigator} isLoaded={isLoaded} /> ))

        return(   
            <View style={styles.container}>
                <SimpleHeader 
                    title="개인 정보"
                    handler={()=>{navigator.pop('UserInfopage')}}
                    notice={''}/>

                <View style={[styles.mainContainer,{opacity:isLoaded?1:0.5}]}>
                    {infoList}
                </View>
            </View>
        )
    }
}

class InfoItem extends Component{
    render(){
        const {payload, navigator, isLoaded} = this.props
        const {key, value, nextPage} = payload
        return (
            <View style={styles.informContainer}>

                <View style={styles.informTypeContainer}>
                    <Text style={styles.informTypeText}>
                        {key}
                    </Text>
                </View>

                <TouchableOpacity style={styles.informValueContainer}
                    disabled={!nextPage || !isLoaded}
                    onPress={()=>{navigator.push(
                        nextPage, {value, handler:()=>this.getUserinfo()})}}>
                    <Text style={styles.informValueText}>{value}</Text>
                </TouchableOpacity>
                         
            </View>
        )
    }
}
    

const styles = StyleSheet.create({
    container:{
        width:'100%',
        height:'100%',
        backgroundColor:'#fff',
        alignItems:'center',
    },
    mainContainer:{
        width:'100%',
        flex:1,
        alignItems:'center'
    },
    informContainer:{
        width:'80%',
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
        color:'#000'
    },
    informValueContainer:{
        flex:2,
        height:'70%',
        justifyContent:'center',
        borderBottomColor:'#ccc',
        borderBottomWidth:1,
    },
    informValueText:{
        fontSize:16
    },
    noticeContainer:{
        width:'80%',
        paddingTop:30
    },
    noticeText:{
        padding:5
    }
})