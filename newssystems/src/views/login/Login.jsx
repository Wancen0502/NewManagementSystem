import React from 'react'

import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'

import ParticlesBackground from './ParticlesBackground.jsx'
import'./Login.css'


import axios from 'axios'



function Login() {

  const navigate = useNavigate();
  
  const onFinish = (values) => {
    console.log('Received values of form: ', values)
    axios.get(`http://localhost:3000/users?username=${values.username}&password=${values.password}&roleState=true`).then
    (res=>{
      console.log(res.data)
      if(res.data.length===0){
        message.error('invaild username or password')

      }else{
        localStorage.setItem("token",JSON.stringify(res.data[0]))
        navigate('/home')
      
      }
    })

  };

    return (
        <div className="login-container">
          <ParticlesBackground/>
           <Form  name="login"
                  className = "login-form"
                  onFinish={onFinish}
            >
              <div className="login-title" >News Management And Publish System</div>
            <Form.Item //usename
                name="username" 
                rules={[
                {
                  required: true,
                  message: 'Please input your Username!',
                },
              ]}
            >
            <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item //password
                name="password"
                rules={[
                {
                  required: true,
                  message: 'Please input your Password!',
                },
              ]}
            >
            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
            </Form.Item>
            <Form.Item>
            <Button block type="primary" htmlType="submit">
            Log in
            </Button>
            </Form.Item>
            </Form>
        </div>
    )
  }
  
  export default Login