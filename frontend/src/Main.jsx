import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const Main = () => {
    const userData = useLocation().state
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
                console.log(res.data);


            })
    }

    useEffect(() => {
        fetch()
    }, [k])

    const handle = e => {

        setNU(e.target.value)

    }

    const submit = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:5000/userName/update/${id}`, {
            username: nu,
        }, {
            headers: { authorization: userData.AT }
        })
            .then((res) => { let d = res.data[0]; console.log(d.username); setk(prev => prev += 1); setEdit('none'); setProfile(res.data[0].username) })
            .catch(err => { console.log('something went wrong'); setEdit('none'); alert(err.response.data) })
    }
    const logout = () => {
        navigate('/', { replace: true })
        window.location.reload()

    }
    return (

        <div className='main'>
            <h2>Jwt Authorization </h2>
            <h4>Logged in as : {profile} <button onClick={logout}>Logout</button></h4>

            <form style={{ display: edit }}>
                <label htmlFor="username">Enter Username</label>
                <input type="text" value={nu} id='username'
                    onChange={e => handle(e)} />
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
