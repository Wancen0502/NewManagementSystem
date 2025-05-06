import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'

import {Table, Button,Tag,notification} from 'antd'

function AuditList() {

   const [dataSource, setDataSource] = useState([])
   const {username} = JSON.parse(localStorage.getItem("token"))

   const navigate = useNavigate();

   useEffect(()=>{
      axios(`/news?author=${username}&auditState_ne=0
      &publishState_lte=1`).then(res=>{
         setDataSource(res.data)
      })
   },[username])


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
         title: 'Censor Status',
         dataIndex: 'auditState',
         render:(auditState) =>{
            const colorList = ["","orange","green","red"]
            const auditList = ["","Under Censor", "Pass", "Failed"]
            return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
         }
       },
      {
        title: 'Action',
        render: (item)=>{
          return <div>
            {  item.auditState===1 &&
               <Button type="primary"
               onClick = {()=>handleRevoke(item)}
              >Revoke</Button>
            }
            {  item.auditState===2 &&
               <Button type="primary" danger
               onClick = {()=>handlePublish(item)}
              >Publish</Button>
            } 
            {  item.auditState===3 &&
               <Button type="primary"
               onClick = {()=>handleRevise(item)}
              >Revise</Button>
            } 
          </div>
        },
      },
    ]

    const handleRevoke = (item)=>{
      setDataSource(dataSource.filter(data=>data.id!==item.id))
      axios.patch(`/news/${item.id}`,{
         auditState:0
      }).then(res=>{
         return(
            notification.info({
            message: "Notification",
            description: "The news can be found at draft box.",
            placement:"bottomRight",
        })
        )
      })
    }

    const handleRevise = (item)=>{
      navigate(`/news-manage/update/${item.id}`)
    }

    const handlePublish=(item)=>{
      axios.patch(`/news/${item.id}`,{
         "publishState":2
       }).then(res=>{
             navigate('/publish-manage/published')
             return(
                 notification.info({
                 message: "Notification",
                 description: "The news can be found at 'Publish Management - Released' ",
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
  
  export default AuditList