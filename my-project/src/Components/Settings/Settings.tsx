import { useEffect,useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Delete from "./Delete";
export default function Settings() {
    const [username,setUsername]=useState("");
    const[passwordError,setPasswordError]=useState("");
    const[error,setError]=useState("");
    const handleSubmit=async(e:any)=>{
        try{
          if(username.length===0 ){
            setError("Username  cannot be empty");
            return;
        }
            e.preventDefault();
            const response=await axios.post("http://localhost:8080/changeusername",new URLSearchParams({
                newUsername:username,
            }).toString(),{
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded",
                },
                withCredentials:true,
            });
            if(response.status===200){
                setError  ("username changed to "+username);
            }
        }catch(error:any){
          console.error(error.response?.data);
          console.log(error);
            if(axios.isAxiosError(error) && error.response?.status===409){
                setError("Username already exists");
            }
            else{
              console.log(error);
                setError("Internal server error");
            }
            return;
        }
    }
    const handlePasswordChange=async(e:any)=>{
        e.preventDefault();
        try{
            const response=await axios.post("http://localhost:8080/changepassword",new URLSearchParams({
              oldPassword:e.target.oldpassword.value,
              newPassword:e.target.newpassword.value,
            }).toString(),{
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded",
                },
                withCredentials:true,
            });
            if(response.status===200){
              setPasswordError("Password changed");
            }
        }catch(error:any){
            if(axios.isAxiosError(error) && error.response?.status===401){
              setPasswordError("Incorrect password");
            }
            else{
              setPasswordError("Internal server error");
    }
  }
}
    const navigate = useNavigate();
    useEffect(() => {
      const checkLogin=async()=>{
        try{
          await axios.get(("http://localhost:8080/checklogin"),{withCredentials:true});
        }catch(error:any){
          if(error.response.status===401){
            navigate("/auth/login");
        }
      }
    }
      checkLogin();
    }, [])
  return (
    <>
      <Navbar></Navbar>
      <div className="z-0">
        <h1 className="mx-auto mt-32 text-4xl font-bold text-center ">Settings</h1>
        <div className="mx-auto w-96">
            <form  onSubmit={handlePasswordChange}>
                <h1 className="mx-auto mt-10 text-2xl font-bold text-center">Change password</h1>
                <label htmlFor="oldpassword" className="block my-4">Old password:</label>
                <input type="password" name="oldpassword" id="oldpassword" className="sm:w-full w-[90%] p-2 border-2 border-solid" />
                <label htmlFor="newpassword" className="block my-4">New password:</label>
                <input type="password" name="newpassword" id="newpassword" className="sm:w-full w-[90%] p-2 border-2 border-solid" />
                <p className="h-10 mx-auto text-red-600">{passwordError}</p>
                <div className="flex justify-center mt-2">
             <button className="w-[100px] p-1 text-white bg-blue-600 rounded hover:bg-blue-700 duration-500 transition-all" type="submit">Change</button>
             </div>
            </form>
            <form  onSubmit={handleSubmit}>
                <h1 className="mx-auto mt-10 text-2xl font-bold text-center">Change username</h1>
                <label htmlFor="newusername" className="block my-4">New username:</label>
                <input type="text" name="newUsername" id="newusername" className="sm:w-full w-[90%] p-2 border-2 border-solid" value={username} onChange={(e) => {
        if (e.target.value.includes(" ")) {
          return;
        }
        setUsername(e.target.value.toLowerCase());
      }} />
           <p className="h-10 mx-auto text-red-600">{error}</p>
             <div className="flex justify-center mt-2">
             <button className="w-[100px] p-1 text-white bg-blue-600 rounded hover:bg-blue-700 duration-500 transition-all" type="submit">Change</button>
             </div>
            </form>
           <Delete/>
              
        </div>
      
      </div>
      
    </>
  )
}
