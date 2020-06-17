
import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default class HeaderContainer extends Component {
    render(){
        const {handleSidebar, handlePop, handleSearch } = this.props
        return(
            <View style={styles.container}>
                <TouchableOpacity style={styles.menuContainer} onPress={handleSidebar}>
                    <Image
                        style={styles.menuImage}
                        source={require('../../assets/icons/menu.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.titleContainer} onPress={()=>handlePop()}>
                    <Text style={styles.titleText}>
                        MAEL PLAY
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.searchContainer}
                    onPress={()=>{handleSearch(true)}}>
                    <Image
                        style={styles.searchImage}
                        source={require('../../assets/icons/search.png')}
                    />
                </TouchableOpacity>
            </View>

        )
        
    }
}
const styles = StyleSheet.create({
    container:{
        width:'100%',
        height:60,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding:5,
    },

    // MENU BUTTON
    menuContainer:{
        position:'absolute',
        height:'100%',
        width:'20%',
        top:0,
        left:0,
        backgroundColor:'#fff',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',

        paddingTop:5
    },menuImage:{
        width:'100%',
        height:'80%',
        resizeMode:'contain'
    },


    // TITLE
    titleContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        height:'100%',
        flex:1
    },titleText:{
        width:'100%',
        fontSize: 26,
        color:'#555',
        fontWeight:'300'
    },

    // SEARCH BUTTON
    searchContainer:{
        position:'absolute',
        height:'100%',
        width:'20%',
        top:0,
        right:0,
        backgroundColor:'#fff',

        paddingTop:5,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },searchImage:{
        width:'100%',
        height:'80%',
        resizeMode:'contain'
    },

})