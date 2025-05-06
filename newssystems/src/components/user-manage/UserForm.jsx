import React,{forwardRef, useEffect, useState} from 'react'
import {Form,Input, Select} from 'antd'

const UserForm = forwardRef((props, ref)=> {

    const [isDisabled, setIsDisabled] = useState(false)

    useEffect(()=>{
        setIsDisabled(props.isUpdateDisabled)
    },[props.isUpdateDisabled])

    const {roleId,region} = JSON.parse(localStorage.getItem("token"))

    const roleObj = {
        "1":"Manager",
        "2":"Regional Senior Editor",
        "3":"Editor"
      }  

    const checkRegionDisabled =(item)=>{
        if(props.isUpdate){
            if(roleObj[roleId]==="Manager"){
                return false
            }else{
                return true
            }

        }else{
            if(roleObj[roleId]==="Manager"){
                return false
            }else{
                return item.value!==region
            }
        }
    }

    const checkRoleDisabled = (item)=>{
        //console.log(item)
        if(props.isUpdated){
            if(roleObj[roleId]==="Manager"){
                return false
            }else{
                return true
            }
        }else{
            if(roleObj[roleId]==="Manager"){
                return false
            }else{
                return roleObj[item.id]!=="Editor"
            }
        }

    }

    return ( 
    <>
    <Form
        ref = {ref}
        layout="vertical"
    >  
    <Form.Item
        name="username"
        label="User Name"
    rules={[
            {
            required: true,
            message: 'Please enter the user name!',
            },
        ]}
    >
        <Input/>
        </Form.Item>
        <Form.Item
            name="password"
            label="Password"
            rules={[
            {
            required: true,
            message: 'Please enter the password!',
            },
        ]}
    >
        <Input/>
        </Form.Item>
        <Form.Item
            name="region"
            label="Branch"
            rules={isDisabled?[]:[
            {
            required: true,
            message: 'Please select the branch for the user!',
            },
        ]}
>
        <Select
             disabled={isDisabled}
            >
            {
            props.regionList.map(item=>
            <Option value={item.value} 
                    key={item.id}
                    disabled={checkRegionDisabled(item)}
            >
                    {item.label}
            </Option>
            )
            }
        </Select>
        </Form.Item>
        <Form.Item
            name="role"
            label="Role"
            rules={[
            {
            required: true,
            message: 'Please set a role for the user!',
            },
        ]}
>
        <Select onChange={(value)=>{
            //console.log(value)
            if(value === "1"){
                setIsDisabled(true)
                ref.current.setFieldsValue({
                    region:""
                })
            }else{
                setIsDisabled(false)
            }
        }}>
            {
            props.roleList.map(item=>
            <Select.Option value={item.value} 
                    key={item.id}
                    disabled={checkRoleDisabled(item)}>
                    {item.roleName}
            </Select.Option>
            )
            }
        </Select>
        </Form.Item>
    </Form>
    </>
 )

})

export default UserForm