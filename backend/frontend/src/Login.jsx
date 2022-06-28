import axiosInsatnce from './config'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  // const url="http://localhost:5000"
  const navigate = useNavigate()
  
  const[un,setUN]=useState('')
  const[pw,setPW]=useState('')
  const fill = (e) => {
    e.preventDefault();
    axiosInsatnce.get(`/userName/user/62b3788ff997f698d12373da`)
      .then(res => {setUN(res.data[0].username); setPW('User 4') })
    }
 
  const success = (res) => {
    navigate('/home', { state: res.data, replace: true })
    // console.log(res)

  }
  const submit = (e) => {
    e.preventDefault();
    axiosInsatnce.post(`/userName/login`, {username:un,password:pw})
      .then(res => (res.status === 200) ? success(res) : '')
      .catch(res => alert(res.response.data))
  }
  return (
    <div>
      <form className='form' >

        <input type="text" placeholder='Username' id='username' value={un} onChange={e => setUN(e.target.value)} />
        <input type="password" placeholder='Password' id='password' value={pw} onChange={e => setPW(e.target.value)} />
        <input type="submit" value='Login' onClick={e => submit(e)} />
        <button className='button' onClick={e => fill(e)}>Click to fill testing credentials</button>
      </form>
    </div>
  )
}

export default Login
