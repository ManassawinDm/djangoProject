import React from 'react'
import { useState, useEffect } from 'react'
import api from '../api';

function Home() {
    const [item, setItem] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    useEffect(()=> {
        getItem();
    },[])

    const getItem = async () => {
        try {
            const res = await api.get("/api/notes/");
            const data = res.data;
            setItem(data);
            console.log(data)
        } catch (err) {
            alert(err)
            console.log(err);
        }
    }

    const deleteItem = async (id) =>{
        try {
            const res = await api.delete(`/api/notes/delete/${id}`);
            if(res.status === 204){
                alert("Note deleted!");
            } else{
                alert("Failed to delete item.");
            }
        } catch (error) {
            alert(error);
            console.log(error)
        }
        getItem()
    }

  return (
    <div>Home</div>
  )
}

export default Home