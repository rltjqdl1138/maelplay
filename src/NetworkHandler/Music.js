import configuration from './configuration'
import * as FileSystem from 'expo-file-system'
const {URL} = configuration

exports.getMyPlaylist = async()=>{
    const fileUri = FileSystem.documentDirectory + 'my_play_list.mael'
    const file = await FileSystem.getInfoAsync(fileUri)
    if(!file || !file.exists)
        await FileSystem.writeAsStringAsync(fileUri, 'MYPLAYLIST[]')
    const result = (await FileSystem.readAsStringAsync(fileUri)).replace('MYPLAYLIST',"")
    return JSON.parse(result)
}
exports.setMyPlaylist = async(list)=>{
    const fileUri = FileSystem.documentDirectory + 'my_play_list.mael'
    const data = JSON.stringify(list)
    await FileSystem.writeAsStringAsync(fileUri, 'MYPLAYLIST'+data)
}
exports.getMusicFromCache = async(uri, auth, _option) =>{
    const option = _option ? _option : {}
    const fileUri = !auth.isLogin ? FileSystem.cacheDirectory +'Sample__' +uri +'.mp3' : FileSystem.cacheDirectory + uri +'.mp3'
    //const CacheTable = await _getCacheTable()
    const file = await FileSystem.getInfoAsync(fileUri)
    if(file && file.exists && !option.force)
        return {uri:file.uri,status:'old'}
    try{
        const remoteUri = URL + '/music/' + uri
        const downloadFile = await FileSystem.downloadAsync(remoteUri, fileUri, {headers:{'x-access-token':auth.token}})
        if(downloadFile.status === 200 || downloadFile.status === 201){
            return {uri:downloadFile.uri, status:'new'}
        }
    }catch(e){
        console.warn(e)
    }
    return {status:'fail', uri:remoteUri}
}
exports.getMainThemeList = async () =>{
    try{
        //TODO: patch the URL
        const response = await fetch(URL+'/api/media/theme',{
            method:'GET',
            headers: { 'Content-Type': 'application/json' } })
        const data = await response.json()
        return data
    }catch(e){
        console.warn(e)
        return {success:false}
    }
}
exports.getMusicList = async(albumID)=>{
    if(!albumID || albumID === '')
        return {success: false}
    try{
        const response = await fetch(URL+'/api/media/music?album='+albumID,{
            method:'GET',
            headers: { 'Content-Type': 'application/json' } })
        const data = await response.json()
        return data
    }catch(e){
        console.warn(e)
        return {success:false}
    }
}

exports.getAlbum = async(albumID)=>{
    if(!albumID || albumID === '')
        return {success: false}
    try{
        const response = await fetch(URL+'/api/media/album?id='+albumID,{
            method:'GET',
            headers: { 'Content-Type': 'application/json' } })
        const data = await response.json()
        return data
    }catch(e){
        console.warn(e)
        return {success:false}
    }
}

/*
const getMusicFile = async(url)=>{

    if(!url)
        return {success:false}

    try{
        const response = await fetch(URL+'/music/'+url, {
            method:'GET',
            headers: {'Content-Type':'application/json'}
        })
        const blob = await response.blob()
        const reader = new FileReader();
        console.warn(reader)
        reader.readAsDataURL(blob);

        return reader
    }catch(e){
        console.warn(e)
    }


}*/