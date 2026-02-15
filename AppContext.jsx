import {createContext,useState,useEffect} from "react";
import axios from "axios";
import {toast} from 'react-toastify'

export const AppContent = createContext()

axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/json';

export const AppContextProvider =(props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [isLoggedin,setIsLoggedin] = useState(false)
    const [userData,setUserData] = useState(false)
     const getAuthState = async () => {
        try{
            if (!backendUrl) {
                console.warn('Backend URL not configured');
                return;
            }
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth');
            if(data.success){
                setIsLoggedin(true);
                await getUserData();
            } else {
                setIsLoggedin(false);
            }

        }catch(error){
            if (error.code === 'ERR_NETWORK') {
                console.error('Network error: Backend server may not be running on', backendUrl);
            } else if (error.response?.status === 404) {
                console.warn('Auth endpoint not found - backend may not be running');
            } else if (error.response?.status === 401) {
                console.log('User not authenticated');
                setIsLoggedin(false);
            } else {
                console.error('Auth error:', error.message);
                setIsLoggedin(false);
            }
        }
    }
    
 const getUserData = async () =>{
    try{
        if (!backendUrl) return;
        const {data} = await axios.get(backendUrl +'/api/user/data')
        if(data.success) {
            setUserData(data.userData)
        } else {
            console.warn('Failed to fetch user data:', data.message);
        }
    }
    catch(error){
                    if (error.code === 'ERR_NETWORK') {
                        console.warn('Network error: Cannot reach backend');
                    } else {
                        console.error('User data error:', error.message);
                    }
    }
 }
     useEffect(() => {
        getAuthState();
    }, [])

    const value ={
        backendUrl,
        isLoggedin,setIsLoggedin,
        userData,setUserData,
        getUserData
    }
    return(
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}