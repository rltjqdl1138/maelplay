import React, {Component} from 'react'
import { View, Text, TouchableOpacity, TouchableHighlight, StyleSheet, Image, ScrollView, Dimensions } from 'react-native'
import * as InAppPurchases from 'expo-in-app-purchases';
import networkHandler from '../networkHandler'
import deviceCheck from '../deviceCheck'

import { PaymentInput, PaymentItem } from '../components/PaymentInfo'
import SimpleHeader from '../components/SimpleHeader'
const {height} = Dimensions.get('window')
const sub = {
    id:0,
    type:0,
    info:'정기구독(subscription) | 10,000원 / mo'
}
const promo = {
    id:1,
    type:1,
    info:'프로모션 (Promo Code) | Free trial 2 month'
}

export default class PlanPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            notice:'정보를 받아오고 있습니다.',
            plans:[],
            isModalOpen:false,
            index:0,
            isLoaded:false
        }
        this.codeLength = 0
    }

    componentDidMount(){
        const notice = '모든 플랜 옵션은 변경 시, 익월 부터 적용됩니다. 정기 구독의 경우 언제든 취소가 가능합니다.'
        const plans = [sub, promo]
        this.loadPayment()
        setTimeout(()=>{
            this.setState(state=>({
                ...state,
                notice,
                plans
            }))
        },2000)
    }
    loadPayment = async()=>{
        try{ await InAppPurchases.connectAsync() }catch(e){ }
        
        try{
            const items = [
                'dev.products.gas',
                'dev.products.premium',
                'dev.products.gold_monthly',
                'dev.products.gold_yearly',
            ]
            const { responseCode, results } = await InAppPurchases.getProductsAsync(items);
            
            if (responseCode === InAppPurchases.IAPResponseCode.OK) {
                console.warn(results)
                
            }

        }catch(e){
            console.warn('is it error')
            console.warn(e)

        }
    }
    handleChange = (field, text) => {
        this.setState({
            [field]: text
        });
    }

    getModal = (items) =>{
        const {isModalOpen, plans} = this.state
        if(!isModalOpen)
            return null
        return (
            <View style={[styles.selectBoxContainer,{
                height:plans.length*50}]}>
                <View style={styles.selectBox}>
                    {items}
                </View>
            </View>

        )


    }
    render(){
        const {navigator} = this.props
        const {handleChange, getNotice, getID} = this
        const {notice, isOpen, isModalOpen, plans, index, isLoaded, list} = this.state
        

        const items = plans.map((item,ind)=>(
                <TouchableOpacity style={{width:'100%',height:50, justifyContent:'center'}}
                    onPress={()=>{this.setState(state=>({...state, isModalOpen:false, index:ind}))}}
                    key={item.id}>
                    <Text style={{fontSize:13,color:index===ind?'#FF6E43':'#121111'  }}>{item.info}</Text>
                </TouchableOpacity>
            ))

        return(
            <View style={styles.container}>
                <SimpleHeader 
                    title="플랜 변경"
                    handler={()=>{navigator.pop('PlanPage')}}
                    notice=''
                    handleComplete={{
                        title: '다음',
                        handler:()=>{navigator.push('PlanPage2',{
                            plan:plans[index] })}
                    }}/>
                <ScrollView contentContainerStyle={styles.mainContainer}
                    keyboardShouldPersistTaps='handled'
                    onScrollBeginDrag={()=>handleChange('isModalOpen',false)}
                    scrollEnabled={false}>
                    <View style={styles.upperContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>
                                플랜 옵션
                            </Text>
                        </View>
                        <View style={styles.noticeContainer}>
                            <Text style={styles.noticeText}>
                                {notice}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.selectContainer}
                            onPress={()=>{handleChange('isModalOpen',!isModalOpen)}}>
                                <Text style={styles.selectText}>
                                    { (plans[index] && plans[index].info)?plans[index].info:''}
                                </Text>
                            <View style={styles.selectButton}>
                                <Image style={styles.selectButtonImage}
                                    source={require('../icon/countryCode.png')} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {this.getModal(items)}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff',
    },

    mainContainer:{
        width:'100%',
        flex:1,
    },
    upperContainer:{
        width:'100%',
        height: 150,
        paddingLeft:25,
        paddingRight:25
    },
    underContainer:{
        width:'100%',
        flex:1,
        justifyContent:'center'
    },
    titleContainer:{
        height:30,
        width:'100%'
    },
    titleText:{
        fontSize:17,
        color:'#121111'
    },
    noticeContainer:{
        height:60,
        width:'100%'
    },
    noticeText:{
        flex:1,
        fontSize:13,
        color:'#767171'
    },
    selectContainer:{
        alignSelf:'center',
        height:42,
        width:'100%',
        borderWidth:1,
        borderColor:'#DEDDDD',
        borderRadius:12,
        flexDirection:'row',
        alignItems:'center'
    },
    selectText:{
        textAlignVertical:'center',
        flex:1,
        paddingLeft:12,
        fontSize:15,
        color:'#121111'
    },
    selectButton:{
        width:29,
        height:'100%',
        alignSelf:'flex-end',
        backgroundColor:'#E2DFDF',
        borderBottomRightRadius:11,
        borderTopRightRadius:11,
        alignItems:'center',
        justifyContent:'center'
    },
    selectButtonImage:{
        width:'50%',
        height:'50%',
        resizeMode:'contain'    
    },
    //103 + 30 + 60 + 42
    selectBoxContainer:{
        alignSelf:'center',
        width:'100%',
        position:'absolute',
        top: deviceCheck.getTopPadding() + 235,
        paddingLeft:25,
        paddingRight:25
    },
    selectBox:{
        width:'100%',
        height:'100%',
        backgroundColor:'#fff',
        borderWidth:1,
        borderColor:'#DEDDDD',
        borderRadius:12,
        paddingLeft:12,
        paddingRight:12
    },

    
    addButtonContainer:{
        height:40,
        width:'100%',
        alignItems:'flex-end',
        backgroundColor:'#fff'
    },
    addButton:{
        width:60,
        marginRight:20,
        height:'100%',
        justifyContent:'center',
    },
    addButtonText:{
        color:'blue',
        textAlign:'center'
    }

})

