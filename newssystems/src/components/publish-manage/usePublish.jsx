//DIY HOOK
import {useEffect, useState} from 'react'
import axios from 'axios'

import {notification} from 'antd'

function usePublish(type){

    const {username} = JSON.parse(localStorage.getItem("token"))
    const [dataSource, setDataSource] = useState([])

   useEffect(()=>{
      axios(`/news?author=${username}&publishState=${type}`).then(res=>{
         //console.log(res.data)
         setDataSource(res.data)
      })
   },[username,type])

   const handelPublish =(id)=>{
        //console.log(id)
        setDataSource(dataSource.filter(item=>item.id!==id))
        axios.patch(`/news/${id}`,{
          "publishState":2,
          "publishTime":Date.now()
       }).then(res=>{
          return(
             notification.info({
             message: "Notification",
             description: "The news can be found at 'Publish Mange - Published'.",
             placement:"bottomRight",
         })
         )
       })

   }

   const handelSunset =(id)=>{
       // console.log(id)
        setDataSource(dataSource.filter(item=>item.id!==id))
        axios.patch(`/news/${id}`,{
          "publishState":3,
       }).then(res=>{
          return(
             notification.info({
             message: "Notification",
             description: "The news can be found at 'Publish Mange - Offline'.",
             placement:"bottomRight",
         })
         )
       })

   }

   const handelDelete =(id)=>{
        //console.log(id)
        setDataSource(dataSource.filter(item=>item.id!==id))
        axios.delete(`/news/${id}`).then(res=>{
          return(
             notification.info({
             message: "Notification",
             description: "The news has been deleted.",
             placement:"bottomRight",
         })
         )
       })

   }

    return {
        dataSource,
        handelPublish,
        handelSunset,
        handelDelete
    }
}

export default usePublish