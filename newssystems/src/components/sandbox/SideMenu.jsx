import React, { useState } from 'react'
import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Layout, Menu} from 'antd';
import {
    HomeOutlined,
    UserOutlined,
    KeyOutlined,
    SafetyCertificateOutlined,
    PaperClipOutlined,
    ScheduleOutlined
  } from '@ant-design/icons';


import './SideMenu.css'

import axios from 'axios'
import SubMenu from 'antd/es/menu/SubMenu';

const { Sider } = Layout;

function SideMenu(props) {

  const [menu, setMenu] = useState([])
  const [collapsed, setCollapsed] = useState(false) // set collapsed of menu items which have sub menu
  //const history = useHistory()
  const [rightList, setRightList] = useState([])
  const navigate = useNavigate()
  // icon list
  const iconList = {
    "/home": <HomeOutlined />,
    "/user-manage":<UserOutlined/>,
    "/right-manage":<KeyOutlined/>,
    "/news-manage":<PaperClipOutlined />,
    "/audit-manage":<SafetyCertificateOutlined />,
    "/publish-manage":<ScheduleOutlined />
    //...
  }

  useEffect(()=>{
    const {roleId} =JSON.parse(localStorage.getItem("token"))
    //console.log(roleId)
    axios.get(`/roles?id=${roleId}`).then
    (res=>{
      //console.log(res.data[0].rights)
      setRightList(res.data[0].rights)
    })
  },[])  


  const checkPagePermission = (items) =>{
    return items.pagepermisson===1 && rightList.includes(items.key)
  }

  //get the data from back-end
  useEffect(()=>{
    axios.get("/rights?_embed=children").then(res=>{
      //console.log(res.data)
      setMenu(res.data)

    })
  },[])

  // read data and generate the menu
  const renderMenu = (menuList) =>{
    return menuList.map(items=>{
      if (items.children?.length>0 && checkPagePermission(items)){
        return <SubMenu key={items.key} title={items.label}
        icon={iconList[items.key]}
        >
          {renderMenu(items.children)}
        </SubMenu>
      }
      return checkPagePermission(items) && <Menu.Item key={items.key} 
      onClick = {()=> navigate(items.key)}
      >{items.label}</Menu.Item>
    })
  }

  return (
        <Sider trigger={null} collapsible collapsed={false}>
        <div className="container" >
        <div className="system-name">News Publish Systems</div>
        <div className="menu-container" >
          <Menu
            className = "side-menu"
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['/home']}
            inlineCollapsed={collapsed}
          > {renderMenu(menu)}
          </Menu>
        </div>
        </div>
      </Sider>
     
    )
  }
  
  export default SideMenu