import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import jwtDecode from 'jwt-decode'

const Main = () => {
    const [userData, setUserData] = useState(useLocation().state)
    console.log(jwtDecode(userData.AT))
    // console.log(userData)
    const navigate = useNavigate()

    const [data, setData] = useState([])
    const [edit, setEdit] = useState('none')
    const [nu, setNU] = useState('')
    const [id, setid] = useState('')
    const [k, setk] = useState(0)
    const [profile, setProfile] = useState(userData.username || '')
    const fetch = async () => {
        await axios.get('http://localhost:5000/userName/')
            .then(res => {
                setData(res.data);
                // console.log(res.data);


            })
    }

    useEffect(() => {
        fetch()
    }, [k])

    const handle = e => {

        setNU(e.target.value)

    }

    const refreshTokens=async(RT)=>{
       await axios.post('http://localhost:5000/userName/refresh',{RT})
        .then((res)=>{
            let nud={...userData,
            "AT":res.data.AT,
            "RT":res.data.RT}
            setUserData(nud)
            console.log('refreshed')
            
        })
        .catch(err=>console.log('error'+err))
    }

    const axiosJWT = axios.create()

    axiosJWT.interceptors.request.use(
        async (config) => {
            let currentTime = new Date()
            let decoded = await jwtDecode(userData.AT)
            if (decoded.exp * 1000 < currentTime.getTime()) {
                console.log('expired')
            }
            await refreshTokens(userData.RT)
            config.headers={ authorization: userData.AT }
            
            return(config)
        },
        (error) => {
            return Promise.reject(error);
          }
    )

    const submit = (e) => {
        e.preventDefault();
        axiosJWT.post(`http://localhost:5000/userName/update/${id}`, {
            username: nu,
        }, {
            headers: { authorization: userData.AT }
        })
            .then((res) => {

                // console.log(res.config.headers.authorization);
                setk(prev => prev += 1);
                setEdit('none');
                setProfile(res.data[0].username)
            })
            .catch(err => {
                // console.log(err);
                setEdit('none');
                alert('Something went wrong')
            })
    }
    const logout = () => {
        axios.post(`http://localhost:5000/userName/logout`)
            .then(() => { })
        navigate('/', { replace: true })
        window.location.reload()

    }
    return (

        <div className='main'>
            <h2>Jwt Authorization </h2>
            <h4>Logged in as : {profile} <button onClick={logout}>Logout</button></h4>

            <form style={{ display: edit }}>
                <label htmlFor="username">Enter new Username</label>
                <input type="text" value={nu} id='username'
                    onChange={e => handle(e)} /><br />
                <input type="submit" onClick={e => submit(e)} />
                <button onClick={(e) => { setEdit('none'); e.preventDefault() }}>Cancel</button>
            </form>
            <div className='users'>
                {data.map(d => (

                    <p key={d._id} >
                        {d.username}
                        <button onClick={() => {
                            setEdit('');
                            setNU(d.username)
                            setid(d._id)

                        }
                        }>Edit</button>

                    </p>
                )
                )}
            </div>


        </div>

    )
}

export default Main
