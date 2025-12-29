import axios from 'axios';
import toast from 'react-hot-toast';
import { InvalidTokenError ,jwtDecode } from  'jwt-decode';

axios.defaults.baseURL = 'http://localhost:8070';

/** Make API Requests */


/** To get username from Token */
export async function getUsername(){
    const token = localStorage.getItem('token')
    if(!token) return  InvalidTokenError
    let decode = jwtDecode(token)
    return decode;
}

/** authenticate function */
export async function authenticate(username){
    try {
        return await axios.post('/api/authenticate', { username })
    } catch (error) {
        return { error : "Username doesn't exist...!"}
    }
}

/** get User details */
export async function getUser({ username }){
    try {
        const { data } = await axios.get(`/api/user/${username}`);
        return { data };
    } catch (error) {
        return { error : "Password doesn't Match...!"}
    }
}

/** register user function */
export async function registerUser(credentials){
    try {
        const { data , status } = await axios.post(`/api/register`, credentials);

        let { username, email } = credentials;
        

        /** send email */
        if(status === 201){
            await axios.post('/api/registerMail', { username, userEmail : email, text : msg})
        }

        return toast.success("Register successfully..!");
    } catch (error) {
        return toast.error( "User Already Exist..!" )
    }
}

/** login function */
export async function verifyPassword({ username, password }){
    try {
        if(username){
            const { data } = await axios.post('/api/login', { username, password,role:'user' })
            return Promise.resolve({ data });
        }
    } catch (error) {
        return Promise.reject({ error : "Password doesn't Match...!"})
    }
}

/** update user profile function */
export async function updateUser(response){
    try {
        
        const token = await localStorage.getItem('token');
        const data = await axios.put('/api/updateuser', response, { headers : { "Authorization" : `Bearer ${token}`}});

        return Promise.resolve({ data })
    } catch (error) {
        return Promise.reject({ error : "Couldn't Update Profile...!"})
    }
}

/** generate OTP */
export async function generateOTP(username){
    try {
        const {data : { code }, status } = await axios.get('/api/generateOTP', { params : { username }});

        // send mail with the OTP
        if(status === 201){
            let { data : { email }} = await getUser({ username });
            let text = `Your Password Recovery OTP is ${code}. Verify and recover your password.`;
            await axios.post('/api/registerMail', { username, userEmail: email, text, subject : "Password Recovery OTP"})
        }
        return toast.success("OTP Generated Successfully");
    } catch (error) {
        return toast.error( "OTP Not Generated" );
    }
}

/** verify OTP */
export async function verifyOTP({ username, code }){
    try {
       const { data, status } = await axios.get('/api/verifyOTP', { params : { username, code }})
       return toast.success("OTP Verified Successfully")
    } catch (error) {
        return  toast.error("OTP Not Verified");
    }
}

/** reset password */
export async function resetPassword({ username, password }){
    try {
        const { data, status } = await axios.put('/api/resetPassword', { username, password });
        return toast.success("Password Changed Successfully")
    } catch (error) {
        return  toast.error( "Password Changeing Unsuccessful" )
    } 
}

//Get Users Data

export async function getUsers(){
    try {
        const { data } = await axios.get(`/api/user/getUsers`);
        return ( users => setUsers(users.data) )
    } catch (error) {
        return (err => console.log(err))
    }
}

