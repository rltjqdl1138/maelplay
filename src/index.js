import React, {Component} from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'
import {Route, Navigator} from './Navigator'
import MainPage from './Pages/MainPage'

export default class RootContainer extends Component{
    render(){
        return(
            <Navigator>
                <Route name="View1" component={View1}/>
                <Route name="View2" component={View2}/>
                <Route name="View3" component={View3}/>
                <Route name="Mainpage" component={MainPage} />
            </Navigator>
        )
    }
}

class View1 extends Component{
    render(){
        return (
            <View style={styles.container}>
                <Text>View1</Text>
                <TouchableOpacity onPress={()=>this.props.navigator.push('View2')}>
                    <Text>Push</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.props.navigator.pop('View1')}>
                    <Text>Pop</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

class View2 extends Component{
    render(){
        return (
            <View style={styles.container}>
                <Text>View2</Text>
                <TouchableOpacity onPress={()=>this.props.navigator.push('View3')}>
                    <Text>Push</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.props.navigator.pop('View2')}>
                    <Text>Pop</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

class View3 extends Component{
    render(){
        return (
            <View style={styles.container}>
                <Text>View3</Text>
                <TouchableOpacity onPress={()=>this.props.navigator.push('Mainpage')}>
                    <Text>Push</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.props.navigator.pop('View3')}>
                    <Text>Pop</Text>
                </TouchableOpacity>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent:'center',
        alignItems:'center'
    },
})