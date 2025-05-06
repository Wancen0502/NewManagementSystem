import React, { useState, useEffect, createContext } from 'react'
import {Table, Tag, Button, Modal,Popover, Switch} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons'

import axios from 'axios'

function RightList() {

  const [dataSource, setDataSource] = useState([])
  const { confirm } = Modal;

  useEffect(()=>{
    axios.get("http://localhost:3000/rights?_embed=children").then(res=>{
      const list = res.data
      list.forEach(item=>{
        if(item.children.length===0){
          item.children = ""
        }
      })
      setDataSource(res.data)
    })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id)=>{
        return <b>{id}</b>
      },
    },
    {
      title: 'Permission',
      dataIndex: 'label',
    },
    {
      title: 'Permission Path',
      dataIndex: 'key',
      render: (key)=>{
        return <Tag color="blue">{key}</Tag>
      },
    },
    {
      title: 'Action',
      render: (item)=>{
        return <div>
           <Button danger shape='circle' icon={<DeleteOutlined/>}
           onClick = {()=>showConfirm(item)}
          />
          <Popover content= {<div style={{textAlign:"center"}}>
            <Switch checked={item.pagepermisson} onChange={()=>
            switchMethod(item)} />
          </div>} title="Permit" 
          trigger={item.pagepermisson===undefined?'':'click'}>
           <Button type="primary" shape='circle' 
                    icon={<EditOutlined/>} 
                    disabled={item.pagepermisson === undefined}/>
           </Popover>
        </div>
      },
    },
  ];

  const switchMethod = (item)=>{
    item.pagepermisson = item.pagepermisson ===1?0:1
    console.log(item)
    setDataSource([...dataSource])

    if (item.grade===1){
      axios.patch(`http://localhost:3000/rights/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }else{
      axios.patch(`http://localhost:3000/children/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }

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
    console.log(item.id)
    console.log(item.grade)
    if(item.grade ===1){
      setDataSource(dataSource.filter(data=>data.id!==item.id))
      axios.delete(`http://localhost:3000/rights/${item.id}`)
    }else{
      console.log(item.rightId)
      let list = dataSource.filter(data=>data.id===item.rightId)
      console.log(item.list)
      list[0].children = list[0].children.filter(data=>data.id!==item.id)
      setDataSource([...dataSource])
      axios.delete(`http://localhost:3000/children/${item.id}`)

    }
    
  }
  
    return (
        <div>
          <Table dataSource={dataSource} columns={columns}
          pagination ={{
            pageSize:5
          }} />
        </div>
    )
  }
  
  export default RightList;