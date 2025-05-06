import React, {useState, useEffect} from 'react'
import axios from 'axios'

import {Table, Button,notification} from 'antd'

import './Audit.css'

function Audit() {

   const [dataSource, setDataSource] = useState([])
   const {roleId,region,username} = JSON.parse(localStorage.getItem("token"))


   useEffect(()=>{
      const roleObj = {
         "1":"Manager",
         "2":"Regional Senior Editor",
         "3":"Editor"
       }  
      axios.get(`/news?auditState=1`).then(res=>{
         const list = res.data
         setDataSource(roleObj[roleId]==="Manager"?list:[
        ...list.filter(item=>item.username===username),
        ...list.filter(item=>item.region===region && 
          roleObj[item.roleId]==="Editor")
      ])
      })
   },[roleId,region,username])

   const columns = [
      {
        title: 'News Title',
        dataIndex: 'title',
        render: (title,item)=>{
          return <a href={`/news-manage/preview/${item.id}`}>{title}</a>
        },
      },
      {
        title: 'Author',
        dataIndex: 'author',
      },
      {
        title: 'News Category',
        dataIndex: 'category',
      },
      {
        title: 'Action',
        render: (item)=>{
          return <div>
               <Button type="primary" onClick = {()=>handleCensor(item,2,1)} >Pass</Button>
               <Button className="reject-button" danger onClick = {()=>handleCensor(item,3,0)}>Reject</Button>
          </div>
        },
      },
    ]

    const handleCensor = (item,auditState,publishState) =>{
      setDataSource(dataSource.filter(data=>data.id!==item.id))
      axios.patch(`/news/${item.id}`,{
        auditState,
        publishState,
      }).then(res=>{
        return(
          notification.info({
          message: "Notification",
          description: "The censor status of the news has been updated which can be found at the censor list.",
          placement:"bottomRight",
      })
      )
      })

      }


    return (
       <div>
         <Table dataSource={dataSource} columns={columns}
         pagination ={{
         pageSize:5
         }}
         rowKey={item=>item.id}
          />  
       </div>
    )
  }
  
  export default Audit