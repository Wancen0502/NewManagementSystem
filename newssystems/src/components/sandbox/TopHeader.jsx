import React, { useState } from 'react'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DownOutlined, 
    SmileOutlined,
    UserOutlined
  } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'
import { Button, Layout, Dropdown, Space, Avatar} from 'antd';

import './TopHeader.css'

const { Header} = Layout;

function TopHeader(props) {

    const[collapsed,setCollapsed]=useState(false);
    const navigate = useNavigate();

    const {role, username} =JSON.parse(localStorage.getItem("token"))


    const items = [
      {
        key: '2',
        label: role,
        icon: <SmileOutlined />,
      },
      {
        key: '4',
        danger: true,
        label: 'login out',
        onClick: ()=>{
          localStorage.removeItem("token")
          //console.log(props.history)
          navigate('/login')
        }
      },
    ];

    return (
        <Header className="top-header"
        >
          <div className="greeting">
            <span className="greeting-sentence"><span style={{color:"#1890ff"}}>{username}</span>, welcome back!</span>
            <Dropdown 
              menu={{
                items,
                }}
            >
              <a onClick={(e) => e.preventDefault()}>
              <Space>
              <Avatar size="large" icon={<UserOutlined />} />
              <DownOutlined/>
            </Space>
          </a>
  </Dropdown>
          </div>
        </Header>
        
    )
  }
  
  export default TopHeader