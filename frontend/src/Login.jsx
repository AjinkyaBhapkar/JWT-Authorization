import axios from 'axios'
import React from 'react'
import { useState } from 'react'

const Login = () => {
    const[credentials,setCred]=useState({username:'',password:''})
    const handel=e=>{
        let form={...credentials}
        form[e.target.id]=e.target.value
        setCred(form)
        console.log(form)
    }

    const submit=()=>{
        axios.post('http://localhost:5000/userName/login',credentials)
    }
  return (
    <div>
      <input type="text" placeholder='Username' id='username' onChange={e=>handel(e)}/>
      <input type="password" placeholder='Password' id='password' onChange={e=>handel(e)}/>
      <input type="submit" onClick={submit} />
    </div>
  )
}

export default Login
