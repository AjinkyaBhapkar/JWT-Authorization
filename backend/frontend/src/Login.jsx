import axiosInsatnce from './config'
import React from 'react'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'

const Login = () => {
  // const url="http://localhost:5000"
  const navigate =useNavigate()
    const[credentials,setCred]=useState({username:'',password:''})
    const handel=e=>{
        let form={...credentials}
        form[e.target.id]=e.target.value
        setCred(form)
        // console.log(form)
    }
    const success=(res)=>{
      navigate('/home',{state:res.data,replace:true})
      // console.log(res)

    }
    const submit=(e)=>{
      e.preventDefault();
        axiosInsatnce.post(`/userName/login`,credentials)
        .then(res=> (res.status===200)?  success(res) :'')
        .catch(res=> alert(res.response.data) )
    }
  return (
    <div>
      <form className='form' >

      <input type="text" placeholder='Username' id='username' onChange={e=>handel(e)}/>
      <input type="password" placeholder='Password' id='password' onChange={e=>handel(e)}/>
      <input type="submit" value='Login' onClick={e=>submit(e)} />
      </form>
    </div>
  )
}

export default Login
