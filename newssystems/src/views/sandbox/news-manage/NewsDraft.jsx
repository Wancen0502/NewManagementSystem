import React, { useState, useEffect} from 'react'
import {Table, Button, Modal, notification} from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  UploadOutlined

} from '@ant-design/icons';

import axios from 'axios'

function NewsDraft() {

  const [dataSource, setDataSource] = useState([])

  const { confirm } = Modal;
  const {username} = JSON.parse(localStorage.getItem("token"))

  const navigate = useNavigate()


    
  // get the data of articles in the draft box (write by current user and haven't submit to censor)
  useEffect(()=>{
    axios.get(`http://localhost:3000/news?author=${username}&auditState=0`).then(res=>{
      setDataSource(res.data)
    })
  }, [username])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id)=>{
        return <b>{id}</b>
      },
    },
    {
      title: 'News Title',
      dataIndex: 'title',
      render:(title,item)=>{
        return <a href={`/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
        title: 'Author',
        dataIndex: 'author',
        
    },
    {
        title: 'News Category',
        dataIndex: "category",
    },
    {
      title: 'Action',
      render: (item)=>{
        return <div>
           <Button danger shape='circle' icon={<DeleteOutlined/>}x
           onClick = {()=>showConfirm(item)}
          />
           <Button   
                    shape='circle' 
                    icon={<EditOutlined/>}
                    onClick ={ ()=>{
                      navigate(`/news-manage/update/${item.id}`)
                    }
                    }  
                    />
           <Button type="primary" shape='circle' 
                    icon={<UploadOutlined 
                            onClick={()=>handleCheck(item.id)} />
                  } 
                    />
        </div>
      },
    },
  ];

  const handleCheck=(id)=>{
      axios.patch(`/news/${id}`,{
        "auditState":1
      }).then(res=>{
            navigate('/audit-manage/list')
            return(
                notification.info({
                message: "Notification",
                description: "The news can be found at censor list",
                placement:"bottomRight",
      })
      )
      })
  }


  // confirm panel after user click delete button
  const showConfirm = (item) => {
    confirm({
      title: 'Do you want to delete this permission?',
      icon: <ExclamationCircleFilled />,
      content:"It is irrevocable",
      onOk() {
        console.log('OK')
        deletMethod(item)
      },
      onCancel() {
        console.log('Cancel')

      },
    });
  };

  // delete permission
  const deletMethod = (item)=>{
    
    setDataSource(dataSource.filter(data=>data.id !==item.id))
    axios.delete(`/news/${item.id}`)

    
    
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
  
  export default NewsDraft;