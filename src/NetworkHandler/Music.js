import configuration from './configuration'
const {URL} = configuration

import * as FileSystem from 'expo-file-system'


exports.getMusicFromCache = async(uri) =>{
    const fileUri = FileSystem.cacheDirectory + uri +'.mp3'
    //const CacheTable = await _getCacheTable()
    const file = await FileSystem.getInfoAsync(fileUri)
    if(file && file.exists){
        //if(!CacheTable[uri])
        //    _appendNewItem({uri, fileUri})
        return {uri:file.uri,status:'old'}
    }
    const remoteUri = URL + '/music/' + uri
    const downloadFile = await FileSystem.downloadAsync(remoteUri, fileUri)
    if(downloadFile.status === 200 || downloadFile.status === 201){
    //    _appendNewItem({uri, fileUri})
        return {uri:downloadFile.uri, status:'new'}
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