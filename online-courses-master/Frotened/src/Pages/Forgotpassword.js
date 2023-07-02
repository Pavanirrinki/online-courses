import React,{useState,useRef} from 'react'
import axios from 'axios';
import {API} from "../Api"
import { Link, useNavigate } from 'react-router-dom'
function Forgotpassword() {
  const [email,setEmail] = useState("")
  const [otp,setOtp] = useState()
  const [password,setPassword] = useState('')
  const [toggle,setToggle] = useState(false)
  const [forgotpassword,setForgotpassword] = useState(false)
  const navigate = useNavigate()
  const sendOtp =(event) =>{
    event.preventDefault();
    axios.post(API+"sendotp", {
  email: email
    })
    .then(res => {
      alert(res.data)
 
    setToggle(!toggle) 
    })
    .catch(error => {
   
      alert(error.response.data);
     
    })
 
  }
  const verifyOtp =(event) =>{
    event.preventDefault();
    axios.post(API+"verify", {
  email: email,
  otprecived:otp
    })
    .then(res => {
      alert(res.data)
      setForgotpassword(!forgotpassword)
    })
    .catch(error => {
   
      alert(error.response.data);
      console.log(typeof(otp))
      setEmail("")
    })
 
  }

  function changepassword(){
    axios.put(API+"forgot-password" ,{
      email: email,
      password
        })
        .then(res => {
          alert(res.data);
    
        })
        navigate("/")
        .catch(error => {
       
          alert(error.response.data);
          console.log(typeof(otp))
          setEmail("")
        })
  }
  return (
    <div className='container' >
      <div className='row d-flex justify-content-center' >
      <div className='col-md-6 col-12'  style={{marginTop:"100px"}}>
        <h1 className='text-center' >Forgot password</h1>
<p className='text-center'>Provide your valid email address</p>
    <div style={{boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)", padding: "20px"}}>
  <form onSubmit={sendOtp}> 
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" value={email} className="form-control"  placeholder="Enter email"   onChange={(e)=>setEmail(e.target.value)}/>
      </div>
      
   
  <button type="submit"  style={{width:"90%",
margin:"30px 60px 10px 20px",
padding:'4px', 
paddingLeft: '40px',
borderRadius:"5px",
border:"none",fontWeight:"bolder"}} className='bg-danger text-white' hidden={!toggle ? false:true}>Send  OTP</button>

    </form>
   {toggle && !forgotpassword ? <form onSubmit={verifyOtp}> 
      <div class="form-group">
        <label for="otp">OTP:</label>
        <input type="number" className="form-control"  placeholder="Enter OTP" value={otp} onChange={(e)=>setOtp(e.target.value)}/>
      </div>
      
   
      <button type="submit"  style={{width:"90%",
margin:"30px 60px 10px 20px",
padding:'4px', 
paddingLeft: '40px',
borderRadius:"5px",
border:"none",fontWeight:"bolder"}} className='bg-danger text-white' >Verify  OTP</button>

    </form>:''}
 
      
  







    {forgotpassword ? <form onSubmit={changepassword}><label for="password">Password:</label>
    <input type="password" class="form-control" id="password" placeholder="Enter your new password" value={password} onChange={(e)=>setPassword(e.target.value)} /><button type="submit" style={{
                width: "90%",
                margin: "30px 60px 10px 20px",
                padding: '4px',
                paddingLeft: '40px',
                borderRadius: "5px",
                border: "none", fontWeight: "bolder"
              }} className='bg-danger text-white'>Submit</button></form>:""}
    </div>

    </div>
  </div>
    </div>
  )
}




export default Forgotpassword
