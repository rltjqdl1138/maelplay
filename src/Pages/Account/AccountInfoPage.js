import React, {Component} from 'react'
import { StyleSheet, View, Text, TouchableOpacity }from 'react-native'

import SimpleHeader from '../../Header/SimpleHeader'
import {Account} from '../../NetworkHandler'

export default class AccountInformationContainer extends Component{
    constructor(props){
        super(props)
        this.state = {
            ID:'',
            date:'',
            planType:'',
            isLoaded:false
        }
    }
    componentDidMount(){
       this.getAccountInfo()
    }
    getAccountInfo = async()=>{
        const response = await Account.getAccountinfo(this.props.auth.token)
        return !response.success ? this.props.navigator.pop('Accountinfopage') :
            this.setState({
                ID: response.data.id,
                date: response.data.createDate,
                planType: response.data.stateID,
                isLoaded:true
            })
    }
    
    render(){
        const {navigator} = this.props
        const {ID, date, planType, isLoaded} = this.state
        const _infoList = [
                {key:'아이디', value:ID, nextPage:null},
                {key:'가입일', value:date, nextPage:null},
                {key:'플랜 타입', value:planType, nextPage:null} ]

        const infoList = _infoList.map((item,index) =>
            ( <InfoItem key={String(index)} payload={item} navigator={navigator} isLoaded={isLoaded}/> ))

        return(   
            <View style={styles.container}>
                <SimpleHeader 
                    title="계정 정보"
                    handler={()=>{navigator.pop('Accountinfopage')}}
                    notice='' />

                <View style={[styles.mainContainer,{opacity:isLoaded?1:0.5}]}>
                    { infoList }

                    <View style={styles.noticeContainer}>
                        <Text style={styles.noticeText}>계정 정보는 ID정보 이외에 외부에 공개 되지 않습니다. </Text>
                        <Text style={styles.noticeText}>플랜 옵션을 변경하고 싶으신가요?</Text>
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity onPress={()=>{this.props.navigator.push('PlanPage')}}>
                                <Text style={[styles.noticeText,{color:'#FF6E43', marginRight:-5}]}>플랜 옵션 변경하기</Text>
                            </TouchableOpacity>
                            <Text style={styles.noticeText}>를 눌러 진행해주세요.</Text>
                        </View>
                    </View>

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
                    disabled={!nextPage || !isLoaded} onPress={()=>{
                        navigator.push(nextPage, {value, handler:()=>this.AccountInfo()})}} >
                    <Text style={styles.informValueText}>
                        {value}
                    </Text>
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