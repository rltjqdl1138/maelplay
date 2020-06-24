import React, {Component} from 'react'
import {StyleSheet, View, Animated, Dimensions } from 'react-native'




export const Route = () => null

const buildSceneConfig = (children = [])=>{
    const config = {}
    children.forEach(child => {
        config[child.props.name] =
            { key: child.props.name,
            component: child.props.component,
            config:{}
        }
    })
    return config
}


class Navigator extends Component {
    constructor(props){
        super(props)
        const sceneConfig = buildSceneConfig(props.children)
        const initialSceneName = props.children[0].props.name
        
        this.state = {
            sceneConfig,
            stack: [sceneConfig[initialSceneName]],
        }
    }
    componentDidMount(){
        this.props.register ? this.props.register({
            push: this.handlePush,
            pop: this.handlePop
        }) : null
    }
    _animatedValue = new Animated.Value(0)
    width = Dimensions.get('window').width

    handlePush = (sceneName, config) =>{
        const { stack, sceneConfig } = this.state
        if(!sceneConfig[sceneName]) return;

        const isThere = (element) => element['key'] === sceneName    
        const ind = stack.findIndex(isThere)
        let middleStack = []

        const newConfig = sceneConfig;
        newConfig[sceneName].config = config ? config : {}
    //BackHandler.addEventListener("hardwareBackPress", ()=>{this.handlePop(sceneName); return true})

        switch(ind){
            case -1:
                this.setState(state => ({
                    sceneConfig: newConfig,
                    stack: [...stack, state.sceneConfig[sceneName]]
                }),()=>{
                    this._animatedValue.setValue(this.width)
                    Animated.timing(this._animatedValue,{
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true
                    }).start()
                })
                break
            case stack.length -1:
                this.setState(state => ({
                    ...state,
                    sceneConfig: newConfig
                }))
                break;
            default:
                this._animatedValue.setValue(this.width)
                middleStack = [ ...stack.slice(0,ind), ...stack.slice(ind+1, stack.length), state.sceneConfig[sceneName] ]
                Animated.timing(this._animatedValue,{
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true
                }).start()
        }
    }
    /*
    handleReplace = (oldSceneName, newSceneName) =>{
        const isThere = (element) => element['key'] === oldSceneName
        const { width } = Dimensions.get('window')
        const { stack } = this.state
        const ind = stack.findIndex(isThere)
        if(!oldSceneName || oldSceneName==='' || ind === -1)
            return;
    }*/
    handlePop = (sceneName) =>{
        const { stack } = this.state
        const isThere = (element) => element['key'] === sceneName
        const lastItem = stack[stack.length-1]
        const ind = stack.findIndex(isThere)
        let middleStack = []
        if(stack.length === 1) return;
        
        switch(ind){
            case stack.length-1:
                middleStack = [...stack]
                break;
            case -1:
            case 0:
                middleStack = [stack[0], lastItem]
                this.setState(state=>({ ...state, stack: middleStack }))
                break;
            default:
                middleStack = [...stack.slice(0,ind), lastItem]
                this.setState(state=>({ ...state, stack: middleStack }))
        }

        Animated.timing(this._animatedValue,{
            toValue: this.width,
            duration: 300,
            useNativeDriver: true
        }).start(()=>{
            this._animatedValue.setValue(0)
            this.setState(state =>({
                ...state,
                stack: middleStack.slice(0, middleStack.length-1)
            }))
        })
    }

    render(){
        return (
            <View style={styles.container}>
                {this.state.stack && this.state.stack.length > 0 ?
                    this.state.stack.map((scene, index)=>{
                        const CurrentScene = scene.component
                        const sceneStyles = [styles.scene]

                        if(index === this.state.stack.length -1 && index > 0)
                            sceneStyles.push({
                                transform:[ {translateX: this._animatedValue} ]
                            })

                        return (
                            <Animated.View key={scene.key} style={[sceneStyles]}>
                                <CurrentScene
                                    navigator={{push:this.handlePush, pop:this.handlePop}}
                                    config={scene.config}
                                    auth={this.props.auth}
                                    handler={this.props.handler}
                                />
                            </Animated.View>
                        )
                    }): null}
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        width:'100%',
        height:'100%'
    },
    scene: {
        ...StyleSheet.absoluteFillObject,
        flex: 1
    }
})


exports.Navigator = Navigator