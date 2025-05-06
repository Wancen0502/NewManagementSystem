import React, {useState, useEffect} from 'react'
import{Table, Button, Modal,Tree} from 'antd'
import axios from 'axios'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';



function RoleList() {

  const {confirm} = Modal
  const [dataSource, setDataSource] = useState([])
  const [rightList, setRightList] = useState([])
  const [currentRights, setCurrentRights] = useState([])
  const [currentId, setCurrentId] = useState(["0"])
  const [isModalVisible, setisModalVisible] = useState(false)

  const columns = [ {
      title:'ID',
      dataIndex:'id',
      render:(id)=>{
        return <p>{id}</p>
      }
    },
    {
      title:'Role',
      dataIndex:'roleName',
      render:(id)=>{
        return <p>{id}</p>
      }
    },
    {
      title: 'Action',
      render: (item)=>{
        return <div>
           <Button danger shape='circle' icon={<DeleteOutlined/>}
           onClick = {()=>showConfirm(item)}
          />
          <Button type="primary" shape='circle' 
                    icon={<EditOutlined/>} 
                    onClick = {()=>{
                      setisModalVisible(true)
                      setCurrentRights(item.rights)
                      setCurrentId(item.id)
                    }}
                    />
        </div>
      },
    },
    ]

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

    const deletMethod = (item)=>{
      //console.log(item.id)
      setDataSource(dataSource.filter(data=>data.id!==item.id))
      axios.delete(`http://localhost:3000/roles/${item.id}`)  
      } 
  

    useEffect(()=>{
      axios.get("http://localhost:3000/roles").then(res=>{
        //console.log(res.data)
        setDataSource(res.data)
      })
    },[])

    useEffect(()=>{
      axios.get("http://localhost:3000/rights?_embed=children").then(res=>{
        //console.log(res.data)
        setRightList(res.data)
      })
    },[])


    const handleOk = ()=>{
      console.log(currentRights)
      setisModalVisible(false)
      setDataSource(dataSource.map(item=>{
        if(item.id===currentId){
          return{
            ...item,
            rights:currentRights
          }
        }
        return item
      }))
      axios.patch(`http://localhost:3000/roles/${currentId}`,{
        rights:currentRights
      })
    }

    const handleCancel = ()=>{
        setisModalVisible(false)
    }

    const onCheck = (checkKeys)=>{
      //console.log(checkKeys)
      setCurrentRights(checkKeys.checked)
      
    }

    return (
        <div>
          <Table dataSource={dataSource} columns={columns} 
          rowKey = {(item)=>item.id}></Table>
          <Modal title="Right Distrubtion" open={isModalVisible} 
          onOk={handleOk} onCancel={handleCancel}>
            <Tree
                checkable
                checkedKeys={currentRights}
                onCheck={onCheck}
                checkStrictly= {true}
                treeData={rightList}
                
    />
          </Modal>
        </div>
    )
  }
  
  export default RoleList 