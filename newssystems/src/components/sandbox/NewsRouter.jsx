import React,{useState,useEffect} from 'react'
import {Routes, Route} from 'react-router-dom'

import Home from '../../views/sandbox/home/Home'

import UserList from '../../views/sandbox/user-manage/UserList'
import RightList from '../../views/sandbox/right-manage/RightList'
import RoleList from '../../views/sandbox/right-manage/RoleList'

import NewsAdd from '../../views/sandbox/news-manage/NewsAdd'
import NewsCategory from '../../views/sandbox/news-manage/NewsCategory'
import NewsDraft from '../../views/sandbox/news-manage/NewsDraft'
import NewsUpdate from '../../views/sandbox/news-manage/NewsUpdate'

import Audit from '../../views/sandbox/aduit-management/Audit'
import AuditList from '../../views/sandbox/aduit-management/AuditList'

import Unpublished from '../../views/sandbox/publish-management/Unpublished'
import Published from '../../views/sandbox/publish-management/Published'
import Sunset from '../../views/sandbox/publish-management/Sunset'

import axios from 'axios'
import Nopermission from '../../views/sandbox/nopermission/Nopermission'

import NProgress from 'nprogress'
import NewsPreview from '../../views/sandbox/news-manage/NewsPreview'

import 'nprogress/nprogress.css'

const localRouterMap ={
    "/home":<Home/>,
    "/user-manage/list":<UserList/>,
    "/right-manage/role/list":<RoleList/>,
    "/right-manage/right/list":<RightList/>,
    "/news-manage/add":<NewsAdd/>,
    "/news-manage/draft":<NewsDraft/>,
    "/news-manage/category":<NewsCategory/>,
    "/audit-manage/audit":<Audit/>,
    "/news-manage/preview/:id":<NewsPreview/>,
    "/news-manage/update/:id":<NewsUpdate/>,
    "/audit-manage/list":<AuditList/>,
    "/publish-manage/unpublished":<Unpublished/>,
    "/publish-manage/published":<Published/>,
    "/publish-manage/sunset":<Sunset/>,
}


function NewsRouter() {

    //NProgress.start()

   // useEffect(() => {
        // NProgress.done()
    //})

    const [BackRouteList, setBackRouteList] = useState([])
    const [userRightList, setUserRightList] = useState([])

    const{roleId} = JSON.parse(localStorage.getItem("token"))

    useEffect(()=>{
        Promise.all([
            axios.get("/rights"),
            axios.get("http://localhost:3000/children"),
        ]).then(res=>{
            //console.log(res)
            setBackRouteList([...res[0].data,...res[1].data])
            //console.log([...res[0].data,...res[1].data])
            //console.log(BackRouteList)
        })
    },[])

    const checkRoute = (item)=>{
       return localRouterMap[item.key] && (item.pagepermisson ||
        item.routepermisson)
    }

    useEffect(()=>{
        axios.get(`http://localhost:3000/roles?id=${roleId}`).then
        (res=>{
          //console.log(res.data[0].rights)
          setUserRightList(res.data[0].rights)
        })
    },[])

    const checkUserPermission=(item)=>{
        return userRightList.includes(item.key) 
   }

    return (
        /*
        <Routes>
              <Route path="/home" element = {<Home/>}/>
              <Route path="/user-manage/list" element = {<UserList/>}/>
              <Route path="/right-manage/role/list" element = {<RoleList/>}/>
              <Route path="/right-manage/right/list" element = {<RightList/>}/>
              <Route path="/news-manage/add" element = {<NewsAdd/>}/>
              <Route path="/news-manage/draft" element = {<NewsDraft/>}/>
              <Route path="/news-manage/category" element = {<NewsCategory/>}/>
              <Route path="/audit-manage/audit" element = {<Audit/>}/>
              <Route path="/audit-manage/list" element = {<AuditList/>}/>
              <Route path="/publish-manage/unpublished" element = {<Unpublished/>}/>
              <Route path="/publish-manage/published" element = {<Published/>}/>
              <Route path="/publish-manage/sunset" element = {<Sunset/>}/>
        </Routes> 
        */
        <Routes>
            {
                BackRouteList.map(item=>{
                   if(checkRoute(item)&& checkUserPermission(item)){
                        return <Route path={item.key} key={item.key} element={localRouterMap[item.key]} exact/>  
                    }
                    return null
                }  
                
                )
            }
            {
                //BackRouteList.length>0 && <Route path="*" element={<Nopermission/>}/>
            }
        </Routes>
    )
  }
  
  export default NewsRouter