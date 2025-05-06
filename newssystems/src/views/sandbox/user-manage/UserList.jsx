import React, { useState, useEffect,useRef} from 'react'
import {Table, Button, Switch,Modal} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons';

import axios from 'axios'

import UserForm from '../../../components/user-manage/UserForm';

function UserList() {

  const {confirm} = Modal
  const [dataSource, setDataSource] = useState([])
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)
  const [regionList, setRegionList] = useState([])
  const [roleList, setRoleList] = useState([])
  const[current, setCurrent] = useState(null)
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)

  const addForm = useRef(null)
  const updateForm = useRef(null)

  const {roleId,region,username} = JSON.parse(localStorage.getItem("token"))

  
  // Get the data we need from back-end

  //region 
  useEffect(()=>{
    axios.get("http://localhost:3000/regions").then(res=>{
      const list = res.data
      setRegionList(list)
    })
  }, [])

  useEffect(()=>{
    const roleObj = {
      "1":"Manager",
      "2":"Regional Senior Editor",
      "3":"Editor"
    }  
    axios.get("http://localhost:3000/users").then(res=>{
      const list = res.data
      setDataSource(roleObj[roleId]==="Manager"?list:[
        ...list.filter(item=>item.username===username),
        ...list.filter(item=>item.region===region && 
          roleObj[item.roleId]==="Editor")
      ])
      //console.log(list)
    })
  }, [roleId,region,username])

  useEffect(()=>{
    axios.get("http://localhost:3000/roles").then(res=>{
      const list = res.data
      setRoleList(list)
    })
  }, [])

  // crerate columns in the table
  const columns = [
    {
      title: 'Branch',
      dataIndex: 'region',
      filters:[ 
        ...regionList.map(items=>({
          text:items.label,
          value:items.value
        })),
        {
          text:"Headquarters",
          value:""
        }
       ],
      onFilter:(value,items)=>items.region===value,
      render: (region)=>{
        return <b>{region===""?'Headquarters': region}</b>
      },
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render:(role)=>{
        return role
      }
    },
    {
      title: 'User Name',
      dataIndex: 'username',
    },
    {
      title: 'User State',
      dataIndex: 'roleState',
      render: (roleState, items)=>{
        return <Switch checked={roleState} disabled={items.default}
        onChange={()=>handleChange(items)}></Switch>
      },
    },
    {
      title: 'Action',
      render: (items)=>{
        return <div>
           <Button  danger shape='circle' 
                    icon={<DeleteOutlined/>}
                    onClick = {()=>showConfirm(items)}  
                    disabled={items.default}
          />
           <Button  type="primary" shape='circle' 
                    icon={<EditOutlined/>} 
                    disabled={items.default}
                    onClick ={()=>handleUpdate(items)}/>
        </div>
      },
    },
  ];

  const handleUpdate = (items)=>{
    setIsUpdateVisible(true)
    if(items.roleId ==="1"){
      setIsUpdateDisabled(true)
    }else{
      setIsUpdateDisabled(false)
    }
    setTimeout(() =>{
      //console.log(items)
      updateForm.current.setFieldsValue(items)
    },0) 
    setCurrent(items)
  }

  const handleChange = (items)=>{
    //console.log(item)
    items.roleState = !items.roleState 
    setDataSource([...dataSource])
    axios.patch(`http://localhost:3000/users/${items.id}`,{
      roleState:items.roleState
    })

  }

  const showConfirm = (items) => {
    confirm({
      title: 'Do you want to delete this user?',
      icon: <ExclamationCircleFilled />,
      content:"It is irrevocable",
      onOk() {
        console.log('OK')
        deletMethod(items)
      },
      onCancel() {
        console.log('Cancel')

      },
    });
  };

  const deletMethod = (items)=>{
      setDataSource(dataSource.filter(data=>data.id!==items.id))
      axios.delete(`http://localhost:3000/users/${items.id}`)
  }

  const addFormOk = ()=>{
    //console.log("add",addForm)
    addForm.current.validateFields().then(value=>{
    //console.log(value)
    let roleId
    let role
    setIsAddVisible(false)
    if (value.role === "1"){
        roleId = "1"
        role = "Manager"
    }
    if(value.role === "2"){
        roleId = "2"
        role = "Regional Sensior Editor"
    }
    if(value.role ==="3"){
        roleId = "3"
        role = "Editor"
    }
    addForm.current.resetFields()
     axios.post(`http://localhost:3000/users`, {
        "password":value.password,
        "username":value.username,
        "roleState":true,
        "roleId":roleId,
        "defalut":false,
        "region":value.region,
        "role": role
     }).then(res=>{
       // console.log(res.data)
        setDataSource([...dataSource,res.data])
     })
   }).catch(err=>{
        console.log(err)
   })
  }

  const updateFormOk =()=>{
    updateForm.current.validateFields().then(value => {
      //console.log(value)
      let roleId
      let role
      setIsUpdateVisible(false)
      if (value.role === "1"){
        roleId = "1"
        role = "Manager"
      }
      if(value.role === "2"){
        roleId = "2"
        role = "Regional Sensior Editor"
      }
      if(value.role ==="3"){
        roleId = "3"
        role = "Editor"
      }

      setDataSource(dataSource.map(items=>{
        //console.log(items)
        if(items.id===current.id){
          return{
            ...items,
            ...value,
            roleId,
            role,
            
          }
        }
        return items
      }))
      setIsUpdateDisabled(!isUpdateDisabled)
      axios.patch(`http://localhost:3000/users/${current.id}`,{
        "username":value.username,
        "password": value.password,
        "region":value.region,
        "roleId":roleId,
        "role":role,
        
      }
      )
    })
    
  }


    return (
        <div>
          <Button type="primary" onClick={() => setIsAddVisible(true)}>Add User</Button>
          <Table dataSource={dataSource} columns={columns}
          pagination ={{
            pageSize:5
          }} 
          rowKey = {items=>items.id}/>
      <Modal
        open={isAddVisible}
        title="Add New User"
        okText="OK"
        cancelText="Cancel"
        onCancel={() => setIsAddVisible(false) }
        onOk={()=> addFormOk()}
      >
        <UserForm regionList={regionList}
                  roleList={roleList}
                  ref = {addForm} />
      </Modal>
      <Modal
        open={isUpdateVisible}
        title="Update User Information"
        okText="Update"
        cancelText="Cancel"
        onCancel={() => {
          setTimeout(() =>{ setIsUpdateVisible(false)})
          setIsUpdateDisabled(!isUpdateDisabled)
          console.log(isUpdateDisabled)
        }
        }
        onOk={()=> updateFormOk()}
      >
        <UserForm regionList={regionList}
                  roleList={roleList}
                  ref = {updateForm}
                  isUpdateDisabled = {isUpdateDisabled}
                  isUpdate = {true}
                  />
      </Modal>
          
        </div>
    )
  }
  
  export default UserList