import { useState } from "react";
import axios from "axios";
export default function Delete() {
    const [popup,setPopup]=useState(false);
    const [secondPopup,setSecondPopup]=useState(false);
    const [passwordError,setPasswordError]=useState("");
    const DeleteUser=async(e:any)=>{
        let password=e.target.password.value;
        e.preventDefault();
        try{
            const response=await axios.post("http://localhost:8080/delete",new URLSearchParams({
                password:password,
            }).toString(),{
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded",
                },
                withCredentials:true,
            });
            if(response.status===200){
                setPasswordError("Account deleted");
                location.reload();
            }
        }catch(error:any){
            if (axios.isAxiosError(error) && error.response?.status===401){
                setPasswordError("Incorrect password");
            }
            else{
                setPasswordError("Internal server error");
            }
        }
    }
  return (
    <div className="my-10">
    <h1 className="mx-auto mt-10 text-2xl font-bold text-center">Delete account</h1>
    <div className="flex justify-center mt-2">
   <button className="w-[100px] p-1 text-white bg-red-600 rounded hover:bg-red-700 duration-500 transition-all my-3 " type="submit" onClick={()=>{
      setPopup(true);
   }}>Delete</button>
   </div>
   {
popup && <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-[#00000070]">
      <div className="card">
      <div className="header">
        <div className="image"><svg aria-hidden="true" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" fill="none">
                    <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" stroke-linejoin="round" stroke-linecap="round"></path>
                  </svg></div>
        <div className="content">
           <span className="title">Delete account</span>
           <p className="message">Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.</p>
        </div>
         <div className="actions">
           <button className="desactivate" type="button" onClick={()=>{
            setSecondPopup(true);
            setPopup(false);
           }}>Delete</button>
           <button className="cancel" type="button" onClick={()=>{
            setPopup(false);
          
           }}>Cancel</button>
        </div>
      </div>
      </div>
      </div>
    }
    {
        secondPopup && <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-[#00000070]">
         <div className="bg-slate-200 w-[300px] h-[300px] rounded-sm flex justify-center items-center flex-col">
                <h1 className="my-2 text-2xl text-center">Delete account</h1>
             <form className="flex flex-col items-center justify-center w-full" onSubmit={DeleteUser}>
                <input type="password" name="password" id="password" className="w-[60%] p-2 border-2 border-solid mx-auto rounded-sm my-2" placeholder="Password"/>
                <p className="h-6 text-red-600">{passwordError}</p>
                <button className="w-[50%] p-1 text-white bg-red-600  hover:bg-red-700 duration-500 transition-all mx-auto my-2 rounded-sm" type="submit">Delete</button>
                <button className="w-[50%] p-1 text-black bg-white  hover:bg-slate-100 duration-500 transition-all mx-auto my-2 rounded-sm" type="submit" onClick={()=>{
                    setSecondPopup(false);
                }}>Cancel</button>
            
             </form>
         </div>
        </div>
    }
  </div>
  )
}
