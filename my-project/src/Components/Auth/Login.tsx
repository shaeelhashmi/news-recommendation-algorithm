import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const handleSubmit = async (e: any) => {
        try {
        
            e.preventDefault();
            if(e.target.username.value.trim().length===0 || e.target.password.value.length===0){
                setError("Username or password  cannot be empty");
                return;
            }
            const username = e.target.username.value;
            const password = e.target.password.value;
            const response = await axios.post(
                "http://localhost:8080/login",
                new URLSearchParams({
                    username: username,
                    password: password,
                }).toString(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    withCredentials: true, // Ensure cookies (session) are sent
                }
            );
            if (response.status === 200) {
                navigate("/");
            } 
        } catch (error: any) {
           if (axios.isAxiosError(error) && error.response?.status === 401) {
               setError("Invalid username or password");
           }
           else{
               setError("Internal server error")
           }

           
        }
    };
    useEffect(() => {
      const checkLogin=async()=>{
        try{
          await axios.get(("http://localhost:8080/checklogin"),{withCredentials:true});
          navigate("/");  
        }catch(error:any){
          console.log(error.response.data)
        }
      }
      checkLogin();
    },[])
  return (
    <div className="flex items-center justify-center h-screen m-0">
      <form action="" className="p-3 h-[400px] w-[350px] bg-white text-md border-2 border-solid shadow-lg" onSubmit={handleSubmit}>
        <h1 className="mb-4 text-4xl font-bold text-center">Login</h1>
        <div className="flex flex-col ">
            <label htmlFor="username">Username:</label>
        <input type="text" name="username" id="username" placeholder="nick"  className="w-[90%] my-4 h-10 rounded-sm p-2 mx-auto border-b-2 border-solid bg-[#F5F5F5]"
        onChange={(e) => {
          if (e.target.value.includes(" ")) {
            return;
          }
          setUsername(e.target.value.toLowerCase());
        }}value={username} />
        
        </div>
        <div className="flex flex-col">
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" id="password" placeholder="*****"  className="w-[90%] my-4 h-10 rounded-sm p-2 mx-auto border-b-2 border-solid bg-[#F5F5F5]"/>
        </div>
        <div className="w-full h-10 text-red-500">{error}</div>
        <a href="/auth/signup" className="h-10 my-3 mb-10 ">Dont have an account? <span className="text-blue-600">Signup</span></a>
        <div className="flex items-center justify-center my-3">
  <button
    type="submit"
    className="w-[200px] h-10 text-center bg-blue-600 text-white rounded-lg"
  >
    Login
  </button>
</div>
      </form>
    </div>
  )
}
