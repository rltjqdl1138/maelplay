import configuration from './configuration'
const {URL} = configuration

exports.getInfo = async(key)=>{
    try{
        const response = await fetch(URL+'/api/notice/'+key)
        const data = await response.json()
        return data
    }catch(e){
        return {success:false}
    }
}
