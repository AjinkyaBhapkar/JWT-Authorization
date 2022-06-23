import React, { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'

const Main = () => {
    const [data, setData] = useState([])
    const [edit, setEdit] = useState('none')
    const [nu,setNU]=useState('')
    const [id,setid]=useState('')
  const[ k,setk]=useState(0)
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
    let newUsername = {}
    const handle = e => {
        // newUsername[e.target.id] = e.target.value
        setNU(e.target.value)
        
    }

    const submit=(e)=>{
        e.preventDefault();
        axios.post(`http://localhost:5000/userName/update/${id}`,{
            username:nu,
            
        })
        .then(()=>{console.log('updated successfully') ; setk(prev=>prev+=1);setEdit('none')})
        .catch(err=> console.log('something went wrong'+err))
    }
    return (
        <div>
            <h2>Jwt Authorization</h2>

            {data.map(d => (

                <p key={d._id} >
                    {d.username}
                    <button onClick={() =>{ 
                         setEdit('') ;
                        setNU(d.username)
                        setid(d._id)
                        
                        }
                        }>Edit</button>

                </p>
            )
            )}
            <form style={{ display: edit }}>
                        <label htmlFor="username">Enter Username</label>
                <input type="text" value={nu} id='username'
                    onChange={e => handle(e)} />
                <input type="submit" onClick={e=>submit(e)} />
                <button onClick={(e)=>{setEdit('none'); e.preventDefault()}}>Cancel</button>
            </form>
        </div>
    )
}

export default Main
