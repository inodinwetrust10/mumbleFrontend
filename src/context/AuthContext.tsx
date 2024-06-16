import {  Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";

type AuthUserType={
  id:string;
  fullname:string;
  username:string;
  profilePic:string;
  gender:string
}
const AuthContext = createContext<{
  authUser:AuthUserType | null;
  setAuthUser:Dispatch<SetStateAction<AuthUserType|null>>;
  isLoading:boolean;
}>({
  authUser:null,
  setAuthUser:()=>{},
  isLoading:true
})



export const useAuthContext = ()=>{
  return useContext(AuthContext)
}

export const AuthContextProvider = ({children}:{children:ReactNode})=>{
  const [authUser,setAuthUser]= useState<AuthUserType| null>(null)
  const [isLoading,setIsLoading]=useState(true)


  useEffect(()=>{
    const fetchAuthUser = async()=>{
      try{
        const res = await fetch("/api/auth/me")
        const data = await res.json();
        if(!res.ok){
          throw new Error(data.error)
        }
        setAuthUser(data)
      }catch(error){
        console.error(error)
      }finally{
        setIsLoading(false)
      }
    }
    fetchAuthUser();
  },[]) // mounts on loading that is ..it will run only once during the first load

  return (
    <AuthContext.Provider value={{authUser,isLoading,setAuthUser}}>
      {children}
    </AuthContext.Provider>
  )
}