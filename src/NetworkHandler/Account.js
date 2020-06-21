import configuration from './configuration'
const {URL} = configuration

exports.getCheckID = async (id, platform)=>{
    if(!id || id === '') return {}
    const response = await fetch(URL+'/api/account/checkid?id='+id+'&platform='+(platform?platform:'original'))
    const data = await response.json()
    return data
}


//
// * REGIST ACCOUNT *
//
exports.registerAccount = async (payload)=>{
    const {id, password, mobile, countryCode, name, birthday, token} = payload
    try{
        const response = await fetch(URL+'/api/account/register',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'x-access-token':token 
            },body:JSON.stringify({
                id, password, mobile, name, countryCode, birthday, platform:'original'
            })
        })
        const data = await response.json()
        return data
    }catch(e){
        return null
    }
}
exports.registerFacebookAccount = async (payload)=>{
    const {id, name, token} = payload
    try{
        const response = await fetch(URL+'/api/account/register',{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },body:JSON.stringify({
                id, name, fbtoken:token, platform:'facebook'
            })
        })
        const data = await response.json()
        return data
    }catch(e){
        return null
    }
}


//
// * LOGIN ACCOUNT *
//
exports.Login = async (id, password)=>{
    if(!id || id ==='' || !password || password ==='')
        return {}
    const response = await fetch(URL+'/api/authentication/',{
        method:'POST',
        headers:
            { 'Content-Type': 'application/json' },
        body: JSON.stringify({'id':id, 'password':password, 'deviceID':'1111', platform:'original'})
    })
    return (await response.json())
}
exports.facebookLogin = async (id, fbtoken)=>{
    const response = await fetch(URL+'/api/authentication/',{
        method:'POST',
        headers:
            { 'Content-Type': 'application/json' },
        body: JSON.stringify({'id':id, 'fbtoken':fbtoken, 'deviceID':'1111', platform:'facebook'})
    })
    const data = await response.json()
    return data
}


//
// * GET INFORMATION *
//
exports.getUserinfo = async (token)=>{
    try{
        const response = await fetch(URL+'/api/account/user',{
            method:'GET',
            headers:{
                'Content-Type': 'application/json',
                'x-access-token': token 
            }
        })
        const data = await response.json()
        return data
    }catch(e){
        return {success:false}
    }
}
exports.getAccountinfo = async (token)=>{

    try{
        const response = await fetch(URL+'/api/account/account',{
            method:'GET',
            headers:{
                'Content-Type': 'application/json',
                'x-access-token': token 
            }
        })
        const data = await response.json()
        return data
    }catch(e){
        return {success:false}
    }
}

//
// * SIGN UP *
//
exports.getCountryCode = async()=>{
    try{
        const response = await fetch(URL+'/api/authentication/countrycode', {
            method:'GET',
            headers: {'Content-Type':'application/json'}
        })
        const data = await response.json()
        return data
    }catch(e){
        console.warn(e)
        return {success:false}
    }
}
exports.mobileAuth = async(mobile, countryCode, type) =>{
    if(!mobile || !countryCode || mobile.length < 10 || mobile.length > 11)
        return { success:false }
    const response = await fetch(URL+'/api/authentication/message',{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({mobile, countryCode, type})
    })
    const data = await response.json()
    return data

}
exports.checkMobileAuth = async(mobile, countryCode, key) =>{
    if(!mobile || !countryCode || mobile.length < 10 || mobile.length > 11)
        return {success:false}
    const response = await fetch(URL+`/api/authentication/message?mobile=${mobile}&countrycode=${countryCode}&key=${key}`,{
        method:'GET',
        headers:{ 'Content-Type': 'application/json' }
    })
    const data = await response.json()
    return data
}





const getForgotID = async (name, email)=>{
    try{
        const response = await fetch(URL+`/api/account/forgotid?email=${email}&name=${name}`,{
            method:'GET',
            headers: { 'Content-Type': 'application/json'} })
        const data = await response.json()
        return data

    }catch(e){
        console.warn(e)
        return {success:false}
    }

}




const changeMobile = async (payload, authToken)=>{
    const { mobile, token } = payload
    try{
        const response = await fetch(URL+'/api/account/mobile',{
            method:'PUT',
            headers:{
                'Content-Type': 'application/json',
                'x-access-token': authToken 
            },body:JSON.stringify({
                mobile, token
            })
        })
        const data = await response.json()
        return data
    }catch(e){
        return null
    }
}

const changeEmail = async (payload, authToken)=>{
    const { email } = payload
    try{
        const response = await fetch(URL+'/api/account/email',{
            method:'PUT',
            headers:{
                'Content-Type': 'application/json',
                'x-access-token': authToken 
            },body:JSON.stringify({
                email
            })
        })
        const data = await response.json()
        return data
    }catch(e){
        return null
    }
}
const changePassword = ()=>{

}

const checkToken = async (token)=>{
    if(!token || token ==='')
        return {success:false}
    try{
        const response = await fetch(URL+'/api/authentication/',{
            method:'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': token }
            })
        const data = await response.json()
        return data

    }catch(e){
        console.warn(e)
        return {success:false}
    }
}