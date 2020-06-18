import configuration from './configuration'
const {URL} = configuration

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